import { TOGGLE_POLLING, SET_INTERVAL, SET_METRICS_ENDPOINT } from '../actions/index';

const initialSettings = {
  isPolling: true,
  interval: 15000,
  metricsEndpoint: 'admin/metrics.json'
};

// Reducers
export function settings(state = initialSettings, action) {
  switch (action.type) {
    case TOGGLE_POLLING:
      return { ...state, isPolling: !state.isPolling };
    case SET_INTERVAL:
      return { ...state, interval: action.payload };
    case SET_METRICS_ENDPOINT:
      return { ...state, metricsEndpoint: action.payload };
    default:
      return state;
  }
};


