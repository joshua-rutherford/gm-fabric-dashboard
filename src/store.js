import { createStore, applyMiddleware, combineReducers } from 'redux';
import { State, Effect, Actions, Hook, CreateJumpstateMiddleware } from 'jumpstate';
import { createLogger } from 'redux-logger';
import reduxPromise from 'redux-promise';
import _ from 'lodash';
import { camelize } from 'humps';
import { routerReducer } from 'react-router-redux';

// State Objects
const metrics = State({
  initial: {},
  fetchMetricsSuccess(state, payload) {
    // Transform each snapshot into a hierarchy of nested objects, where the lowest level is an object
    // of key value pairs, where the key is the time stamp in UNIX time and the value is the value of
    // the metric at that timestamp.
    const snapshot = {};
    const time = Date.now();
    for (let key in payload) {
      // Change from slash delimited to dot delimited and from snake case to camel case to be able to
      // use the lodash set method to build a idiomatic JSON hierarchy of data
      let path = camelize(key.replace(/\//gi, '.'));
      _.setWith(snapshot, `${path}.${time}`, payload[key], Object);
    }
    // Deep merge the new snapshot into the existing state object.
    return _.merge({}, state, snapshot);
  },
  clearMetrics(state, payload) {
    return {};
  }
});

const settings = State({
  initial: {
    isPolling: true,
    pollingHasInitialized: false,
    interval: 15000,
    metricsEndpoint: 'admin/metrics.json'
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
  setMetricsEndpoint(state, payload) {
    return { ...state, metricsEndpoint: payload };
  }
});

// Effects
Effect('fetchMetrics', (endpoint) => {
  fetch(endpoint || '/admin/metrics.json', { mode: 'cors' }) // TODO: Fix this hack
    .then(results => Actions.fetchMetricsSuccess(results.json()));
});
Effect('startPolling', ({ endpoint, interval }) => {
  window.refreshMetricsInterval = setInterval((endpoint) => Actions.fetchMetrics(endpoint), interval);
});
Effect('stopPolling', (endpoint, interval) => {
  clearInterval(window.refreshMetricsInterval);
});

// Hooks

// Automatically start polling the default endpoint using the default interval on initial page load.
Hook((action, getState) => {
  if (!getState().settings.pollingHasInitialized) {
    Actions.setPollingAsInitialized();
    Actions.startPolling({
      endpoint: getState().settings.metricsEndpoint,
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

// Start the interval when an action sets state.settings.isPolling to true
Hook((action, getState) => {
  if (action.type === 'togglePolling' && getState().settings.isPolling) {
    Actions.startPolling({
      endpoint: getState().settings.metricsEndpoint,
      interval: getState().settings.interval
    });
  }
});

// Stop the interval, change the endpoint, and restart when state.settings.metricsEndpoint is changed while polling is live
Hook((action, getState) => {
  if (action.type === 'setInterval' && getState().settings.isPolling) {
    Actions.stopPolling();
    Actions.startPolling({
      endpoint: getState().settings.metricsEndpoint,
      interval: getState().settings.interval
    });
  }
});

// Stop the interval, change the endpoint, and restart when state.settings.interval is changed while polling is live
Hook((action, getState) => {
  if (action.type === 'setInterval' && getState().settings.setMetricsEndpoint) {
    Actions.stopPolling();
    Actions.startPolling({
      endpoint: getState().settings.metricsEndpoint,
      interval: getState().settings.interval
    });
  }
});

// Putting it all together
export default createStore(
  combineReducers({ metrics, settings, routing: routerReducer }),
  applyMiddleware(
    reduxPromise,
    CreateJumpstateMiddleware(),
    createLogger({ collapsed: true })
  )
);
