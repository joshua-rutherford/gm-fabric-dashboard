import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import HTTPConnectionsAreaChart from './HTTPConnectionsAreaChart';
import DataTxLineChart from './DataTxLineChart';
import HTTPStats from './HTTPStats';
import DataTotals from './DataTotals';

class HTTPGrid extends Component {
  static propTypes = {
    metrics: PropTypes.array.isRequired
  };
  
  render() {
    return (
      <div>
        <div
          className="uk-grid-match uk-text-center"
          data-uk-grid
          data-uk-grid-small
          data-uk-height-match="row: false"
          data-uk-sortable
        >
          <div className="uk-width-1-2@l">
            <HTTPStats metricsArr={this.props.metrics} />
          </div>
          <div className="uk-width-1-2@l">
            <DataTotals metricsArr={this.props.metrics} />
          </div>
          <div className="uk-width-1-2@l">
            <HTTPConnectionsAreaChart metricsArr={this.props.metrics} />
          </div>
          <div className="uk-width-1-2@l">
            <DataTxLineChart metricsArr={this.props.metrics} />
          </div>
        </div>
      </div>
    );
  };
};

function mapStateToProps({ metrics }) {
  return { metrics };
};

export default connect(mapStateToProps)(HTTPGrid);
