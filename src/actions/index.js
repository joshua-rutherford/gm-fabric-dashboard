
// The endpoint is hardcoded for the MVP.
// This should be configurable and pulled from Redux in the future
// const METRICS_ENDPOINT = '/admin/metrics.json?pretty=true';
const METRICS_ENDPOINT = 'admin/metrics.json';

export const FETCH_METRICS = 'FETCH_METRICS';
export const CLEAR_METRICS = 'CLEAR_METRICS';

export const TOGGLE_POLLING = 'TOGGLE_POLLING';
export const SET_INTERVAL = 'SET_INTERVAL';
export const SET_METRICS_ENDPOINT = 'SET_METRICS_ENDPOINT';

export function fetchMetrics() {
  const response = fetch(METRICS_ENDPOINT, { mode: 'cors' })
    .then((response) => response.json());
  return {
    type: FETCH_METRICS,
    payload: response
  };
}

export function clearMetrics() {
  return {
    type: CLEAR_METRICS
  };
}

export function togglePolling(){
  return {
    type: TOGGLE_POLLING
  };
}
export function setInterval(interval){
  return {
    type: SET_INTERVAL,
    payload: interval
  };
}

// Note: This is not yet utilized anywhere
export function setMetricsEndpoint(metricsEndpoint){
  return {
    type: SET_METRICS_ENDPOINT,
    payload: metricsEndpoint
  };
}
