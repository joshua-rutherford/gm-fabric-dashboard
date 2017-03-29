import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import HTTPConnectionsAreaChart from './HTTPConnectionsAreaChart';
import HTTPStats from './HTTPStats';
import DataTotals from './DataTotals';

class HTTPGrid extends Component {
  render() {
    return (
      <div>
        <h1 className="uk-heading-line uk-text-center"><span>HTTP</span></h1>
        <div
          className="uk-grid-match uk-grid-small uk-text-center"
          data-uk-grid
        >
          <div className="uk-width-1-2@m">
            <HTTPStats metricsArr={this.props.metrics} />
          </div>
          <div className="uk-width-1-2@m">
            <DataTotals metricsArr={this.props.metrics} />
          </div>
          <div className="uk-width-1-2@m">
            <HTTPConnectionsAreaChart metricsArr={this.props.metrics} />
          </div>
          <div className="uk-width-1-2@m">
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title">Data Tx Rates</h3>
              <img
                alt="Fill Murray"
                src="https://placeimg.com/300/200/animals"
              />
            </div>
          </div>
          <div className="uk-width-1-2@m">
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title">Advisor Moods</h3>
              <img
                alt="Fill Murray"
                src="https://placeimg.com/300/200/arch"
              />
            </div>
          </div>
          <div className="uk-width-1-2@m">
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title">Random Walks</h3>
              <img
                alt="Fill Murray"
                src="https://placeimg.com/300/200/nature"
              />
            </div>
          </div>
          <div className="uk-width-1-2@m">
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title">Fauna Breeding</h3>
              <img
                alt="Fill Murray"
                src="https://placeimg.com/300/200/people"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
};

HTTPGrid.propTypes = {
  metrics: PropTypes.array.isRequired
};

function mapStateToProps({ metrics }) {
  return { metrics };
};

export default connect(mapStateToProps)(HTTPGrid);
