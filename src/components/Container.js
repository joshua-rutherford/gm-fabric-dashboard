import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { Actions } from "jumpstate";
import { connect } from "react-redux";

import Navbar from "./Navbar";
import SummaryBar from "./SummaryBar";

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
      <div className="uk-container uk-container-expand" id="app-container">
        <Navbar />
        <SummaryBar />
        <div className="uk-background-default" data-uk-grid data-uk-grid-margin>
          <main className="uk-width-1-1@s">
            {this.props.children}
          </main>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ settings: { metricsEndpoints, runtime } }) {
  return { metricsEndpoints, runtime };
}

export default connect(mapStateToProps)(Container);
