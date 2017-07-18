import { State } from "jumpstate";

import {
  getRuntime,
  generateEndpoints,
  generateThreadsEndpoint
} from "../utils";

const settings = State({
  initial: {
    baseUrl: "/",
    isPolling: true,
    pollingHasInitialized: false,
    interval: 15000,
    metricsEndpoints: generateEndpoints(),
    threadsEndpoint: generateThreadsEndpoint(),
    pollingFailures: 0,
    runtime: getRuntime(),
    threadsFilter: "all"
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

export default settings;
