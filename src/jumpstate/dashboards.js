import { State, getState } from 'jumpstate';

import initialDashboards from '../json/dashboards.json';

const dashboards = State({
  initial: initialDashboards, // key always must be lowercase
  fetchDashboardsSuccess(state, dashboards) {
    const newState = Object.assign({}, state);
    dashboards.forEach(dashboard => {
      if (dashboard.runtime === getState().settings.runtime) {
        newState[dashboard.route] = dashboard;
      }
    });
  }
});

export default dashboards;
