import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import GMBasicMetrics from './GMBasicMetrics';
import GMLineChart from './GMLineChart';
import GMTable from './GMTable';
import { getLatestAttribute, getTimeSeriesOfValue, getTimeSeriesOfNetChange, mergeTimeSeries, parseJSONString } from '../utils';
import { Responsive, WidthProvider } from 'react-grid-layout';
import _ from 'lodash';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

/**
 * Reuseable component for rendering a grid
 *
 * Pulls the dashboard matching URL param from Redux and renders it.
 */
class GMGrid extends Component {
  static propTypes = {
    dashboards: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    metrics: PropTypes.object.isRequired
  };

  render() {
    const { dashboards, metrics } = this.props;
    const selectedDashboardName = _.hasIn(this.props, ['match', 'params', 'dashboardName']) && this.props.match.params.dashboardName.replace("%2F", "/").toLowerCase();
    const dashboard = dashboards[selectedDashboardName]; // This should be case insensitive at all times
    if (!dashboard) return <div>{`Dashboard ${selectedDashboardName} does not exist`}</div>;
    return (
      <div>
        <ResponsiveReactGridLayout
          breakpoints={dashboard.grid.breakpoints}
          cols={dashboard.grid.cols}
          rowHeight={dashboard.grid.rowHeight}
        >
          {dashboard.charts.map((chart) => {
            return (
              <div
                data-grid={chart.position}
                key={chart.title}
                style={{
                  border: 'solid',
                  overflow: 'hidden'
                }}  
              >
                {chart.type === "GMLineChart" &&
                  <GMLineChart
                    detailLines={chart.data.detailLines && chart.data.detailLines.map(line => parseJSONString(line, metrics))}
                    timeSeries={
                      mergeTimeSeries(
                        chart.data.timeseries.map(
                          ts => {
                            switch (ts.type) {
                              case 'netChange':
                                return getTimeSeriesOfNetChange(metrics, ts.attribute, ts.label, ts.baseUnit, ts.resultUnit, ts.precision);
                              case 'value':
                              default:  
                                return getTimeSeriesOfValue(metrics, ts.attribute, ts.label, ts.baseUnit, ts.resultUnit, ts.precision);
                            }
                          }
                        )
                      )
                    }
                    title={chart.title}
                  />
                }
                {chart.type === "GMTable" &&
                  <GMTable
                    headers={chart.data.headers}
                    rows={chart.data.rows.map((row, outerIdx) => {
                      return row.map((cell, innerIdx) => {
                        if (innerIdx === 0) {
                          return cell;
                        } else if (innerIdx > 0) {
                          return getLatestAttribute(metrics, cell);
                        }
                      });
                    })}
                    title={chart.title}
                  />
                }
                {chart.type === "GMBasicMetrics" &&
                  <GMBasicMetrics
                    detailLines={_.fromPairs(_.toPairs(chart.data.detailLines).map(pair =>
                      [pair[0], getLatestAttribute(metrics, pair[1])]
                    ))}
                    title={chart.title}
                  />
                }
              </div>  
            );
          })}  
        </ResponsiveReactGridLayout>
      </div>
    );
  };
};

function mapStateToProps({ dashboards, metrics }) {
  return { dashboards, metrics };
};

export default connect(mapStateToProps)(GMGrid);
