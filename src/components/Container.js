import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { Actions } from "jumpstate";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import AppBrandBar from "./AppBrandBar";
import AppToolBar from "./AppToolBar";
import SummaryBar from "./SummaryBar";
import Explorer from "./Explorer";
import GMGrid from "./GMGrid";
import SummaryGrid from "./SummaryGrid";
import SettingsGrid from "./SettingsGrid";
import RouteBar from "./RouteBar";
import RouteGrid from "./RouteGrid";
import ThreadsGrid from "./ThreadsGrid";
import { Route, Redirect, Switch } from "react-router-dom";
import NotFound from "./NotFound";

class Container extends Component {
  static propTypes = {
    children: PropTypes.any,
    metricsEndpoints: PropTypes.array,
    runtime: PropTypes.string
  };

  // Perform an initial fetch of metrics on mount.
  // This triggers hooks which initialize polling using the default parameters
  componentDidMount() {
    Actions.fetchMetrics(this.props.metricsEndpoints);
    Actions.initLocalForage();
    Actions.fetchDashboards();
    if (this.props.runtime === "jvm") Actions.fetchThreads();
  }

  render() {
    return (
      <div id="app-container">
        <nav
          className="uk-width-1-6@s sidebar"
          style={{ backgroundColor: "black" }}
        >
          <AppBrandBar />
          <SummaryBar />
        </nav>
        <div className="uk-width-5-6@s">
          <AppToolBar />
          <Route exact path="/" render={() => <Redirect to="/summary" />} />
          <Switch>
            {this.props.runtime === "JVM" &&
              <Route component={SummaryGrid} path="/summary" />}
            {this.props.runtime === "JVM" &&
              <Route component={ThreadsGrid} path="/threads" />}
            <Route component={Explorer} path="/explorer" />
            <Route component={SettingsGrid} path="/settings" />
            {this.props.runtime === "JVM" &&
              <Route component={RouteBar} path="/route" />}
            <Route component={GMGrid} path="/dashboard/:dashboardName" />
            <Route component={NotFound} path="*" />
          </Switch>
          <Route component={RouteGrid} path="/route/:routeName" />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ settings: { metricsEndpoints, runtime } }) {
  return { metricsEndpoints, runtime };
}

export default withRouter(connect(mapStateToProps)(Container));
