import { createStore, applyMiddleware, combineReducers } from 'redux';
import { State, Effect, Actions, Hook, CreateJumpstateMiddleware } from 'jumpstate';
import logger from 'redux-logger';
import { notification } from 'uikit';
import _ from 'lodash';
import { camelize } from 'humps';
import { routerReducer } from 'react-router-redux';
import { getBasename } from './utils';
import axios from 'axios';

// State Objects
const metrics = State({
  initial: {},
  fetchMetricsSuccess(state, payload) {
    // Transform each snapshot into a hierarchy of nested objects, where the lowest level is an object
    // of key value pairs, where the key is the time stamp in UNIX time and the value is the value of
    // the metric at that timestamp.
    let snapshot = {};
    let time = Date.now();
    _.forIn(payload, (value, key) => {
      if (key === 'threads') {
        let threadIds = Object.keys(value);
        const results = threadIds.map(id => ({
          name: value[id].thread,
          id: id,
          priority: value[id].priority,
          state: value[id].state,
          daemon: value[id].daemon,
          stack: value[id].stack
        }));
        // Threads Table is the latest state of all threads ready for display in a table component
        _.setWith(snapshot, `threadsTable`, results);
        // Threads is a structure similar to the other metrics that is able to use the utility
        // functions to render time charts.
        results.forEach(resultObj => {
          _.setWith(snapshot, `threads.${resultObj.name}.jvm-id-${resultObj.id}.${time}`, resultObj);
        });
      }
      else {
        let path = camelize(key.replace(/\//gi, '.'));
        // Change from slash delimited to dot delimited and from snake case to camel case to be able to
        // use the lodash set method to build a idiomatic JSON hierarchy of data
        _.setWith(snapshot, `${path}.${time}`, value);
      }
    });
    // Deep merge the new snapshot into the existing state object.
    return _.merge({}, state, snapshot);
  },
  clearMetrics(state, payload) {
    return {};
  }
});

const settings = State({
  initial: {
    baseUrl: '/',
    isPolling: true,
    pollingHasInitialized: false,
    interval: 15000,
    metricsEndpoints: [`admin/metrics.json`, 'admin/threads'],
    pollingFailures: 0,
    threadsFilter: 'all'
  },
  setBaseUrl(state, payload) {
    return { ...state, baseUrl: payload };
  },
  setPollingAsInitialized(state, payload) {
    return { ...state, pollingHasInitialized: true };
  },
  togglePolling(state, payload) {
    return { ...state, isPolling: !state.isPolling };
  },
  setInterval(state, payload) {
    return { ...state, interval: payload };
  },
  setMetricsEndpoints(state, payload) {
    return { ...state, metricsEndpoints: payload };
  },
  setThreadsFilter(state, payload) {
    return { ...state, threadsFilter: payload };
  },
  incrementPollingFailures(state, payload) {
    const pollingFailures = state.pollingFailures + 1;
    return { ...state, pollingFailures };
  },
  resetPollingFailures(state, payload) {
    return { ...state, pollingFailures: 0 };
  }
});

// Effects
Effect('fetchMetrics', (endpoints) => {
  if (!endpoints) return;
  const basename = getBasename();
  Promise.all(endpoints.map(endpoint => axios.get(`${basename}${endpoint}`, { responseType: 'json' })))
    .then(jsons => jsons.map(json => json.data))
    .then(jsons => {
      let results = {};
      jsons.forEach(json => {
        results = { ...results, ...json };
      });
      return results;
    })
    .then(json => Actions.fetchMetricsSuccess(json))
    .catch(err => Actions.fetchMetricsFailure(err));
});
Effect('fetchMetricsFailure', (err) => {
  notification('Fetching /admin/metrics.json failed', { status: 'danger' });
  Actions.incrementPollingFailures();
});
Effect('startPolling', function ({ endpoints, interval }) {
  const refreshMetricsFunctionFactory = (endpoints) => () => {
    const eps = endpoints;
    if (eps && eps.length) Actions.fetchMetrics(eps);
  };
  window.refreshMetricsInterval = window.setInterval(refreshMetricsFunctionFactory(endpoints), interval);
});
Effect('stopPolling', (endpoints, interval) => {
  clearInterval(window.refreshMetricsInterval);
});

// Hooks

// Automatically start polling the default endpoint using the default interval on initial page load.
Hook((action, getState) => {
  if (!getState().settings.pollingHasInitialized) {
    Actions.setPollingAsInitialized();
    Actions.startPolling({
      endpoints: getState().settings.metricsEndpoints,
      interval: getState().settings.interval
    });
  };
});

// Clear the interval when an action sets state.settings.isPolling to false
Hook((action, getState) => {
  if (action.type === 'togglePolling' && !getState().settings.isPolling) {
    Actions.stopPolling();
  }
});

// Stop polling after three failures and reset failure counter
// The Notification will persist for 24 hours unless manually dismissed by the user.
Hook((action, getState) => {
  const pollingFailures = getState().settings.pollingFailures;
  if (action.type === 'fetchMetricsSuccess' && pollingFailures > 0) {
    Actions.resetPollingFailures();
  } else if (getState().settings.pollingFailures > 2) {
    notification('Automatically disabling the fetching of metrics after three attempts. You can turn polling back on in Settings.',
      {
        status: 'danger',
        timeout: 86400000
      }
    );
    Actions.resetPollingFailures();
    Actions.togglePolling();
  }
});

// Start the interval when an action sets state.settings.isPolling to true
Hook((action, getState) => {
  if (action.type === 'togglePolling' && getState().settings.isPolling) {
    Actions.startPolling({
      endpoints: getState().settings.metricsEndpoints,
      interval: getState().settings.interval
    });
  }
});

// Stop the interval, change the endpoint, and restart when state.settings.interval is changed while polling is live
Hook((action, getState) => {
  if (action.type === 'setInterval') {
    Actions.stopPolling();
    Actions.startPolling({
      endpoints: getState().settings.metricsEndpoints,
      interval: getState().settings.interval
    });
  }
});

const middlewares = [];
middlewares.push(CreateJumpstateMiddleware());
if (process.env.NODE_ENV === `development`) {
  middlewares.push(logger);
}  

// Putting it all together
export default createStore(
  combineReducers({ metrics, settings, routing: routerReducer }),
  applyMiddleware(...middlewares)
);
