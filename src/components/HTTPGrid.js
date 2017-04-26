import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import HTTPConnectionsAreaChart from './HTTPConnectionsAreaChart';
import DataTxLineChart from './DataTxLineChart';
import HTTPStats from './HTTPStats';
import DataTotals from './DataTotals';
import { getLatestAttribute, getAttributeOverTime, getAttributeOverTimeAsPondTimeSeries, getAttributeChangesOverTime, getAttributeChangesOverTimeAsPondTimeSeries, mergeResults } from '../utils';

class HTTPGrid extends Component {
  static propTypes = {
    http: PropTypes.object,
    jvm: PropTypes.object
  };

  render() {
    const { jvm, http, route } = this.props;
    return (
      <div>
        <div
          className="uk-grid-match uk-grid-small uk-text-center"
          data-uk-grid
        >
          <div className="uk-width-1-2@l">
            <HTTPConnectionsAreaChart
              connectionsArr={getAttributeOverTime(http, 'connections')}
              connectionsTimeSeries={getAttributeOverTimeAsPondTimeSeries(http, 'connections')}
              requestsTimeSeries={getAttributeChangesOverTimeAsPondTimeSeries(http, 'requests')}
            />
          </div>
          <div className="uk-width-1-2@l">
            <DataTxLineChart
              receivedAndSentBytesPerSecondArr={mergeResults(getAttributeChangesOverTime(http, 'sentBytes'), getAttributeChangesOverTime(http, 'receivedBytes'))}
            />
          </div>
          <div className="uk-width-1-2@l">
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title">HTTP Routes</h3>
              {route && Object.keys(route).map(route => {
                return (
                  <Link
                    className="uk-link-muted"
                    key={route}
                    to={`/route/${route}`}
                  >/{route}</Link>
                );
              })}
            </div>
          </div>
          <div className="uk-width-1-4@l">
            <HTTPStats
              appUptime={getLatestAttribute(jvm, 'uptime')}
              totalHTTPRequests={getLatestAttribute(http, 'requests')}
              totalSuccessfulHTTPRequests={getLatestAttribute(http, 'success')}
            />
          </div>
          <div className="uk-width-1-4@l">
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

function mapStateToProps({ metrics: { http, jvm, route } }) {
  return { http, jvm, route };
};

export default connect(mapStateToProps)(HTTPGrid);
