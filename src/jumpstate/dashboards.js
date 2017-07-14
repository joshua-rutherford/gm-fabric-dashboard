import { State } from 'jumpstate';

const dashboards = State({
  initial: {},
  updateDashboardsRedux(state, dashboards) {
    return dashboards;
  }
});

export default dashboards;
