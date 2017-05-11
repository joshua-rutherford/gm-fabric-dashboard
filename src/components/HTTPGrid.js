import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import HTTPConnectionsAreaChart from './HTTPConnectionsAreaChart';
import DataTxLineChart from './DataTxLineChart';
import HTTPStats from './HTTPStats';
import DataTotals from './DataTotals';
import { getLatestAttribute, getAttributeOverTime, getAttributeChangesOverTime, mergeResults } from '../utils';

class HTTPGrid extends Component {
  static propTypes = {
    http: PropTypes.object,
    jvm: PropTypes.object
  };

  render() {
    const { jvm, http } = this.props;
    return (
      <div className="uk-section uk-section-default" id="summary-grid">
        {http && http.connections &&
          <div className="">
            <HTTPConnectionsAreaChart
              connectionsArr={getAttributeOverTime(http, 'connections')}
            />
          </div>
        }
        {http && (http.sentBytes || http.receivedBytes) &&
          <div className="">
            <DataTxLineChart
              receivedAndSentBytesPerSecondArr={mergeResults(getAttributeChangesOverTime(http, 'sentBytes'), getAttributeChangesOverTime(http, 'receivedBytes'))}
            />
          </div>
        }
        <div className="">
          <HTTPStats
            appUptime={getLatestAttribute(jvm, 'uptime')}
            totalHTTPRequests={getLatestAttribute(http, 'requests')}
            totalSuccessfulHTTPRequests={getLatestAttribute(http, 'success')}
          />
        </div>
        <div className="">
          <DataTotals
            receivedBytes={getLatestAttribute(http, 'receivedBytes')}
            sentBytes={getLatestAttribute(http, 'sentBytes')}
          />
        </div>
      </div>
    );
  };
};

function mapStateToProps({ metrics: { http, jvm } }) {
  return { http, jvm };
};

export default connect(mapStateToProps)(HTTPGrid);
