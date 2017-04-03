import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import JVMHeapLineChart from './JVMHeapLineChart';

class JVMGrid extends Component {
  static propTypes = {
    metrics: PropTypes.array.isRequired
  };
  
  render() {
    return (
      <div>
        <div
          className="uk-grid-match uk-grid-small uk-text-center"
          data-uk-grid
        >
          <div className="uk-width-1-2@l">
            <JVMHeapLineChart metricsArr={this.props.metrics} />
          </div>
          <div className="uk-width-1-2@l">
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title">Data Tx Rates</h3>
              <img
                alt="Fill Murray"
                src="https://placeimg.com/300/200/animals"
              />
            </div>
          </div>
          <div className="uk-width-1-2@l">
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title">Advisor Moods</h3>
              <img
                alt="Fill Murray"
                src="https://placeimg.com/300/200/arch"
              />
            </div>
          </div>
          <div className="uk-width-1-2@l">
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title">Random Walks</h3>
              <img
                alt="Fill Murray"
                src="https://placeimg.com/300/200/nature"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
};

function mapStateToProps({ metrics }) {
  return { metrics };
};

export default connect(mapStateToProps)(JVMGrid);
