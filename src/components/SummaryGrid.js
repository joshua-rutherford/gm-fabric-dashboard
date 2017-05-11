import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { getLatestAttribute } from '../utils';
import dateFormat from 'dateformat';
import ms from 'ms';

class SummaryGrid extends Component {
  static propTypes = {
    jvm: PropTypes.object
  }
  render() {
    const { jvm } = this.props;
    return (
      <div className="uk-section uk-section-default">
        <div
          className="uk-grid-small uk-child-width-1-2@s"
          data-uk-grid
          id="summary-grid"
        >
          <div className="uk-panel">
            <div className="summary-grid-title">Start Time</div>
            <div>{dateFormat(getLatestAttribute(jvm, 'startTime'))}</div>
            <div className="summary-grid-title">Uptime</div>
            <div>{ms(getLatestAttribute(jvm, 'uptime'))}</div>
          </div>
          <div className="uk-panel">
            <div className="summary-grid-title">Processor Cores</div>
            <div>{getLatestAttribute(jvm, 'numCpus')}</div>
            <div className="summary-grid-title">IP Address or Domain Name</div>
            <div>{`${window.location.hostname}:${window.location.port}`}</div>
          </div>
        </div>
      </div>
    );
  };
};

function mapStateToProps({ metrics: { jvm } }) {
  return { jvm };
};

export default connect(mapStateToProps)(SummaryGrid);
