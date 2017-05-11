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
      <div className="uk-section uk-section-default">
        <div
          className="uk-grid-match uk-grid-collapse"
          data-uk-grid
        >
          {http && http.connections &&
            <div className="uk-width-1-4@l uk-width-1-2@s">
              <HTTPConnectionsAreaChart
                connectionsArr={getAttributeOverTime(http, 'connections')}
              />
            </div>
          }
          {http && (http.sentBytes || http.receivedBytes) &&
            <div className="uk-width-1-4@l uk-width-1-2@s">
              <DataTxLineChart
                receivedAndSentBytesPerSecondArr={mergeResults(getAttributeChangesOverTime(http, 'sentBytes'), getAttributeChangesOverTime(http, 'receivedBytes'))}
              />
            </div>
          }
          <div className="uk-width-1-4@l uk-width-1-2@s">
            <HTTPStats
              appUptime={getLatestAttribute(jvm, 'uptime')}
              totalHTTPRequests={getLatestAttribute(http, 'requests')}
              totalSuccessfulHTTPRequests={getLatestAttribute(http, 'success')}
            />
          </div>
          <div className="uk-width-1-4@l uk-width-1-2@s">
            <DataTotals
              receivedBytes={getLatestAttribute(http, 'receivedBytes')}
              sentBytes={getLatestAttribute(http, 'sentBytes')}
            />
          </div>
        </div>
      </div>
    );
  };
};

function mapStateToProps({ metrics: { http, jvm } }) {
  return { http, jvm };
};

export default connect(mapStateToProps)(HTTPGrid);
