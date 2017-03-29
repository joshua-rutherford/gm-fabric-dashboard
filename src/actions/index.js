
// The endpoint is hardcoded for the MVP. 
// This should be configurable and pulled from Redux in the future
// const METRICS_ENDPOINT = '/admin/metrics.json?pretty=true';
const METRICS_ENDPOINT = 'admin/metrics.json';

export const FETCH_METRICS = 'FETCH_METRICS';

export function fetchMetrics() {
  const response = fetch(METRICS_ENDPOINT, { mode: 'cors' })
    .then((response) => response.json());

  return {
    type: FETCH_METRICS,
    payload: response
  };
}


