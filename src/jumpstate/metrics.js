import { State } from 'jumpstate';
import _ from 'lodash';

// State Objects
const metrics = State({
  initial: {},
  fetchMetricsSuccess(state, payload) {
    const timestamp = Date.now() + "";
    const snapshot = {};
    Object.keys(payload).forEach(metric => {
      const timeSeries = {};
      timeSeries[timestamp] = payload[metric];
      snapshot[metric] = timeSeries;
    });
    // Deep merge the new snapshot into the existing state object.
    return _.merge({}, state, snapshot);
  },
  clearMetrics(state, payload) {
    return {};
  }
});

export default metrics;
