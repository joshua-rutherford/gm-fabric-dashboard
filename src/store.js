import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Effect, Actions, Hook, CreateJumpstateMiddleware } from 'jumpstate';
import logger from 'redux-logger';
import { notification } from 'uikit';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import axios from 'axios';

import { getBasename, generateThreadsEndpoint } from './utils';
import { history } from './index';
import metrics from './jumpstate/metrics';
import settings from './jumpstate/settings';
import threadsTable from './jumpstate/threadsTable';
import dashboards from './jumpstate/dashboards';

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
  notification('Fetching Metrics failed', { status: 'danger' });
  console.log('Fetching Metrics failed', err);
  Actions.incrementPollingFailures();
});

Effect('fetchThreads', (endpoint = generateThreadsEndpoint()) => {
  if (!endpoint) return;
  axios.get(`${getBasename()}${endpoint}`, { responseType: 'json' })
    .then(json => Actions.fetchThreadsSuccess(json.data))
    .catch(err => Actions.fetchThreadsFailure(err));
});

Effect('fetchThreadsFailure', (err) => {
  notification('Fetching Threads Data failed', { status: 'danger' });
  console.log('Fetching Threads failed', err);
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
  combineReducers({ metrics, settings, threadsTable, dashboards, routing: routerReducer }),
  applyMiddleware(...middlewares)
);
