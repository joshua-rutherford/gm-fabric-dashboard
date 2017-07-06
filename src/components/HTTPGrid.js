import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import GMLineChart from './GMLineChart';
import GMTable from './GMTable';
import DataTotals from './DataTotals';
import { getLatestAttribute, getTimeSeriesOfValue, getTimeSeriesOfNetChange, mergeTimeSeries, mapOverTimeSeries } from '../utils';
import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class HTTPGrid extends Component {
  static propTypes = {
    http: PropTypes.object,
    https: PropTypes.object
  };

  render() {
    const { http, https } = this.props;
    return (
      <div>
        <ResponsiveReactGridLayout
          breakpoints={{lg: 1200, md: 996, sm: 768}}  
          cols={{lg: 12, md: 8, sm: 4}}
          rowHeight={60}
        >
          <div
            data-grid={{ x: 0, y: 0, w: 4, h: 6, minW: 3, minH: 4 }}
            key='a'
            style={{
              border: 'solid',
              overflow: 'hidden'
            }}  
          >
            <GMLineChart
              timeSeries={mergeTimeSeries(
                getTimeSeriesOfValue(http, 'connections', 'httpConnections'),
                getTimeSeriesOfValue(https, 'connections', 'httpsConnections')
              )}
              title={`HTTP Connections`}
            />
          </div>  
          <div
            data-grid={{ x: 4, y: 0, w: 4, h: 6, minW: 3, minH: 4  }}
            key='b'
            style={{
              border: 'solid',
              overflow: 'hidden'
            }}  
          >
            <GMLineChart
              timeSeries={mapOverTimeSeries(
                mergeTimeSeries(
                  getTimeSeriesOfNetChange(http, 'sentBytes', 'httpSentBytes'),
                  getTimeSeriesOfNetChange(https, 'sentBytes', 'httpsSentBytes'),
                  getTimeSeriesOfNetChange(http, 'receivedBytes', 'httpReceivedBytes'),
                  getTimeSeriesOfNetChange(https, 'receivedBytes', 'httpsReceivedBytes')
                ),
                ['httpSentBytesPerSecond','httpsSentBytesPerSecond','httpReceivedBytesPerSecond', 'httpSendBytesPerSecond'],
                (value) => Math.round(value / 1024)
              )}
              title={`Data Transfer Rates (KBps)`}
            />
          </div>
          <div
            data-grid={{ x: 8, y: 0, w: 4, h: 6, minH: 4, minW: 3 }}
            key='c'
            style={{ border: 'solid' }}
          >
            <GMTable
              headers={["Requests", "Success"]}
              rows={[
                ["http", getLatestAttribute(http, 'requests'), getLatestAttribute(http, 'success')],
                ["https", getLatestAttribute(https, 'requests'), getLatestAttribute(https, 'success')]
              ]}
              title="HTTP Stats"
              totalHTTPRequests={getLatestAttribute(http, 'requests')}
              totalHTTPSRequests={getLatestAttribute(https, 'requests')}
              totalSuccessfulHTTPRequests={getLatestAttribute(http, 'success')}
              totalSuccessfulHTTPSRequests={getLatestAttribute(https, 'success')}
            />
          </div>
          <div
            data-grid={{ x: 0, y: 0, w: 4, h: 5, minW: 2, minH: 3 }}
            key='d'
            style={{border: 'solid'}}  
          >
            <DataTotals
              receivedBytes={getLatestAttribute(https, 'receivedBytes') + getLatestAttribute(http, 'receivedBytes')}
              sentBytes={getLatestAttribute(https, 'sentBytes') + getLatestAttribute(http, 'sentBytes')}
            />
          </div>
        </ResponsiveReactGridLayout>
      </div>
    );
  };
};

function mapStateToProps({ metrics: { http, https } }) {
  return { http, https };
};

export default connect(mapStateToProps)(HTTPGrid);
