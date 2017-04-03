import { createStore, applyMiddleware, combineReducers } from 'redux';
import { State, Effect, Actions, Hook, CreateJumpstateMiddleware } from 'jumpstate';
import { createLogger } from 'redux-logger';
import reduxPromise from 'redux-promise';

// State Objects
const metrics = State({
  initial: [],
  fetchMetricsSuccess(state, payload) {
    return [...state, { date: Date.now(), data: payload }];
  },
  clearMetrics(state, payload) {
    return [];
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
  fetch(endpoint || 'admin/metrics.json', { mode: 'cors' }) // TODO: Fix this hack
    .then(results => Actions.fetchMetricsSuccess(results.json()));
});
Effect('startPolling', ({ endpoint, interval }) => {
  console.log(`starting polling of ${endpoint} every ${interval}ms`)
  window.refreshMetricsInterval = setInterval((endpoint) => Actions.fetchMetrics(endpoint), interval);
});
Effect('stopPolling', (endpoint, interval) => {
  clearInterval(window.refreshMetricsInterval);
});

// Hooks

// Automatically start polling the default endpoint using the default interval on initial pageload.
Hook((action, getState) => {
  if (!getState().settings.pollingHasInitialized) {
    console.log(`Initializing Polling of ${getState().settings.metricsEndpoint} every ${getState().settings.interval}`);
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
  combineReducers({ metrics, settings }),
  applyMiddleware(
    reduxPromise,
    CreateJumpstateMiddleware(),
    createLogger({ collapsed: true })
  )
);
