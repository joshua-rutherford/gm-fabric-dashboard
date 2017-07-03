import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Actions } from 'jumpstate';
import { connect } from 'react-redux';

import Navbar from './Navbar';
import SummaryBar from './SummaryBar';
import GolangSummaryBar from './golang/SummaryBar';

class Container extends Component {
  static propTypes = {
    children: PropTypes.any,
    metricsEndpoints: PropTypes.array
  }

  // Perform an initial fetch of metrics on mount.
  // This triggers hooks which initialize polling using the default parameters
  componentDidMount() {
    Actions.fetchMetrics(this.props.metricsEndpoints);
  }

  render() {
    return (
      <div
        className="uk-container uk-container-expand"
        id="app-container"
      >
        <Navbar />
        {this.props.runtime === 'JVM' && <SummaryBar />}
        {this.props.runtime === 'GOLANG' && <GolangSummaryBar />}
        <div
          className="uk-background-default"
          data-uk-grid
          data-uk-grid-margin
        >
          <main className="uk-width-1-1@s">
            {this.props.children}
          </main>
        </div>
      </div>
    );
  };
}

function mapStateToProps({settings: { metricsEndpoints, runtime }}) {
  return { metricsEndpoints, runtime };
};

export default connect(mapStateToProps)(Container);
