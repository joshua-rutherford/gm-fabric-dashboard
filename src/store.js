import axios from "axios";
import localforage from "localforage";
import _ from "lodash";
import {
  Effect,
  Actions,
  Hook,
  getState,
  CreateJumpstateMiddleware
} from "jumpstate";
import { routerReducer, routerMiddleware } from "react-router-redux";
import { createStore, applyMiddleware, combineReducers } from "redux";
import logger from "redux-logger";
import { notification } from "uikit";

import {
  getBasename,
  getRuntime,
  generateThreadsEndpoint,
  filterDashboardsByRuntime
} from "./utils";
import { history } from "./index";
import metrics from "./jumpstate/metrics";
import settings from "./jumpstate/settings";
import threadsTable from "./jumpstate/threadsTable";
import dashboards from "./jumpstate/dashboards";
import defaultDashboards from "./json/dashboards.json";

// Effects / Asynchronous Actions

/**
 * Async Action that fetches metrics and calls success or failure actions.
 * endpoints is an array of strings containing URL endpoints
 */
Effect("fetchMetrics", endpoints => {
  if (!endpoints) return;
  const runtime = getRuntime();
  // This block allows us to direclty poll Envoy metrics from a single source
  // Everything beyond the first endpoint is discarded
  // The data is transformed from statsd format into a flat object of key/value pairs
  if (runtime === "ENVOY") {
    axios
      .get(endpoints[0], { responseType: "text" }) // Only poll the first endpoint
      .then(response => response.data)
      // A statsd file contains key value pairs delimited by : and terminated by \n
      .then(statsdTextFile => {
        let results = {};
        statsdTextFile
          .split("\n")
          .map(kv => kv.split(": "))
          .forEach(([key, value]) => {
            if (key) {
              results[key] = Number(value);
            }
          });
        return results;
      })
      .then(json => Actions.fetchMetricsSuccess(json))
      .catch(err => Actions.fetchMetricsFailure(err));
  } else {
    Promise.all(
      endpoints.map(endpoint => axios.get(endpoint, { responseType: "json" }))
    )
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
  }
});

/**
 * Action that handles fetch thread errors, notifying the user via a popup and the console
 * and incrementing a counter that disables the polling interval on repeat failures.
 */
Effect("fetchMetricsFailure", err => {
  notification("Fetching Metrics failed", { status: "danger" });
  console.log("Fetching Metrics failed", err);
  Actions.incrementPollingFailures();
});

/**
 * Action that fetches threads information (JVM) and stores in Redux
 */
Effect("fetchThreads", (endpoint = generateThreadsEndpoint()) => {
  if (!endpoint) return;
  axios
    .get(endpoint, { responseType: "json" })
    .then(json => Actions.fetchThreadsSuccess(json.data))
    .catch(err => Actions.fetchThreadsFailure(err));
});

/**
 * Action that handles fetch thread errors, notifying the user via a popup and the console
 */
Effect("fetchThreadsFailure", err => {
  notification("Fetching Threads Data failed", { status: "danger" });
  console.log("Fetching Threads failed", err);
});

/**
 * Action that starts a polling interval for scraping metrics, overwriting if needed
 */
Effect("startPolling", function({ endpoints, interval }) {
  const refreshMetricsFunctionFactory = endpoints => () => {
    const eps = endpoints;
    if (eps && eps.length) Actions.fetchMetrics(eps);
  };
  window.refreshMetricsInterval = window.setInterval(
    refreshMetricsFunctionFactory(endpoints),
    interval
  );
});

/**
 * Action that clears the polling interval for metrics scraping
 */
Effect("stopPolling", (endpoints, interval) => {
  clearInterval(window.refreshMetricsInterval);
});

/**
 * Synchronous action that performs initial setup of localforage
 */
Effect("initLocalForage", () => {
  localforage.config({
    name: `grey-matter-fabric-${getBasename()}`,
    description:
      "Persistent storage of Grey Matter Fabric dashboards and settings"
  });
});

/**
 * Asynchronous action that fetches dashboards from localforage if they exist
 * and falls back to the default dashboards if not found
 */
Effect("fetchDashboards", () => {
  localforage
    .getItem("dashboards")
    .then(savedDashboards => {
      const runtime = getState().settings.runtime;
      if (
        savedDashboards &&
        _.every(savedDashboards, dashboard => dashboard.runtime === runtime)
      ) {
        console.log("fetchDashboards returned valid data: ", savedDashboards);
        const dashboardsForRuntime = filterDashboardsByRuntime(
          savedDashboards,
          getState().settings.runtime
        );
        console.log("DBs: ", dashboardsForRuntime);
        if (Object.keys(dashboardsForRuntime).length > 0) {
          Actions.updateDashboardsRedux(dashboardsForRuntime);
        }
        Actions.updateDashboardsRedux(savedDashboards);
      } else {
        console.log(
          "fetchDashboards data was null, so loading default dashboards"
        );
        const dashboardsForRuntime = filterDashboardsByRuntime(
          defaultDashboards,
          runtime
        );
        console.log("DBs: ", dashboardsForRuntime);
        if (Object.keys(dashboardsForRuntime).length > 0) {
          Actions.updateDashboardsRedux(dashboardsForRuntime);
        }
      }
    })
    .catch(err => console.log("fetchDashboards failed with ", err));
});

/**
 * Asynchronous action that takes an updated dashboard, merges it into the dashboards
 * object and then writes it to Redux and local storage
 */
Effect("updateDashboard", updatedDashboard => {
  const dashboards = _.merge({}, getState().dashboards, updatedDashboard);
  Actions.updateDashboardsRedux(dashboards);
  localforage
    .setItem("dashboards", dashboards)
    .then(data =>
      console.log("Successfully persisted dashboards to local storage: ", data)
    )
    .catch(err =>
      console.log("Failed to persist dashboards to local storage: ", err)
    );
});

/**
 * Asynchronous action that clears all dashboard state from Redux and Local Storage,
 * forcing the defaults to reload.
 */
Effect("clearDashboards", () => {
  Actions.updateDashboardsRedux(defaultDashboards);
  localforage
    .removeItem("dashboards")
    .then(data =>
      console.log("Successfully cleared dashboards from local storage: ", data)
    )
    .catch(err =>
      console.log("Failed to clear dashboards from local storage: ", err)
    );
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
  }
});

// Clear the interval when an action sets state.settings.isPolling to false
Hook((action, getState) => {
  if (action.type === "togglePolling" && !getState().settings.isPolling) {
    Actions.stopPolling();
  }
});

// Stop polling after three failures and reset failure counter
// The Notification will persist for 24 hours unless manually dismissed by the user.
Hook((action, getState) => {
  const pollingFailures = getState().settings.pollingFailures;
  if (action.type === "fetchMetricsSuccess" && pollingFailures > 0) {
    Actions.resetPollingFailures();
  } else if (getState().settings.pollingFailures > 2) {
    notification(
      "Automatically disabling the fetching of metrics after three attempts. You can turn polling back on in Settings.",
      {
        status: "danger",
        timeout: 86400000
      }
    );
    Actions.resetPollingFailures();
    Actions.togglePolling();
  }
});

// Start the interval when an action sets state.settings.isPolling to true
Hook((action, getState) => {
  if (action.type === "togglePolling" && getState().settings.isPolling) {
    Actions.startPolling({
      endpoints: getState().settings.metricsEndpoints,
      interval: getState().settings.interval
    });
  }
});

// Stop the interval, change the endpoint, and restart when state.settings.interval is changed while polling is live
Hook((action, getState) => {
  if (action.type === "setInterval") {
    Actions.stopPolling();
    Actions.startPolling({
      endpoints: getState().settings.metricsEndpoints,
      interval: getState().settings.interval
    });
  }
});

// Persist dashboards to localStorage
Hook((action, getState) => {
  if (action.type === "setInterval") {
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
  combineReducers({
    metrics,
    settings,
    threadsTable,
    dashboards,
    routing: routerReducer
  }),
  applyMiddleware(...middlewares)
);
