import { createStore, applyMiddleware, combineReducers } from 'redux';
import { State, getState, Effect, Actions, Hook, CreateJumpstateMiddleware } from 'jumpstate';
import logger from 'redux-logger';
import { notification } from 'uikit';
import _ from 'lodash';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { getBasename, getRuntime, generateEndpoints, parseJVMMetrics, parseGolangMetrics } from './utils';
import axios from 'axios';
import { history } from './index';

// State Objects
const metrics = State({
  initial: {},
  fetchMetricsSuccess(state, payload) {
    let snapshot;
    const settings = getState().settings;
    const runtime = (settings && settings.runtime) ? settings.runtime : '';
    switch (runtime) {
      case 'GOLANG':
        snapshot = parseGolangMetrics(payload);
        break;
      case 'JVM':
        snapshot = parseJVMMetrics(payload);
        break;
      default:
        snapshot = {};
    };
    
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
    metricsEndpoints: generateEndpoints(),
    pollingFailures: 0,
    runtime: getRuntime(),
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

// Prepare Redux Middlewares
const middlewares = [];
middlewares.push(CreateJumpstateMiddleware());
middlewares.push(routerMiddleware(history));
if (process.env.NODE_ENV === `development`) {
  middlewares.push(logger);
}  

// Create the Redux store using reducers and middlewares
export default createStore(
  combineReducers({ metrics, settings, routing: routerReducer }),
  applyMiddleware(...middlewares)
);
