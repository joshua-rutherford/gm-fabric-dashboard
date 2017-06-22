import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import HTTPConnectionsChart from './HTTPConnectionsChart';
import DataTxChart from './DataTxChart';
import HTTPStats from './HTTPStats';
import DataTotals from './DataTotals';
import { getLatestAttribute, getAttributeOverTime, getAttributeChangesOverTime, mergeResults } from '../utils';

class HTTPGrid extends Component {
  static propTypes = {
    http: PropTypes.object,
    https: PropTypes.object
  };

  render() {
    const { http, https } = this.props;
    return (
      <div>
        <div
          className="uk-grid-match uk-grid-collapse uk-text-center"
          data-uk-grid
        >
          {((https && https.connections) || (http && http.connections)) &&
            <div className="uk-width-1-2@l uk-width-1-2@s">
              <HTTPConnectionsChart
                connectionsArr={mergeResults(
                  getAttributeOverTime(http, 'connections', 'httpConnections'),
                  getAttributeOverTime(https, 'connections', 'httpsConnections')
                )}
              />
            </div>
          }
          {https && (https.sentBytes || https.receivedBytes) &&
            <div className="uk-width-1-2@l uk-width-1-2@s">
              <DataTxChart
                httpReceivedAndSentBytesPerSecondArr={mergeResults(
                  getAttributeChangesOverTime(http, 'sentBytes'),
                  getAttributeChangesOverTime(http, 'receivedBytes')
                )}
                httpsReceivedAndSentBytesPerSecondArr={mergeResults(
                  getAttributeChangesOverTime(https, 'sentBytes'),
                  getAttributeChangesOverTime(https, 'receivedBytes')
                )}
              />
            </div>
          }
          <div className="uk-width-1-2@l uk-width-1-2@s">
            <HTTPStats
              totalHTTPRequests={getLatestAttribute(http, 'requests')}
              totalHTTPSRequests={getLatestAttribute(https, 'requests')}
              totalSuccessfulHTTPRequests={getLatestAttribute(http, 'success')}
              totalSuccessfulHTTPSRequests={getLatestAttribute(https, 'success')}
            />
          </div>
          <div className="uk-width-1-2@l uk-width-1-2@s">
            <DataTotals
              receivedBytes={getLatestAttribute(https, 'receivedBytes') + getLatestAttribute(http, 'receivedBytes')}
              sentBytes={getLatestAttribute(https, 'sentBytes') + getLatestAttribute(http, 'sentBytes')}
            />
          </div>
        </div>
      </div>
    );
  };
};

function mapStateToProps({ metrics: { http, https } }) {
  return { http, https };
};

export default connect(mapStateToProps)(HTTPGrid);
