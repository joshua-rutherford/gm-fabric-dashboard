import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { camelize } from "humps";
import _ from 'lodash';
import {
  mergeTimeSeries,
  getLatestAttribute,
  getTimeSeriesOfNetChange
} from "../utils";
import GMLineChart from "./GMLineChart";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class SummaryGrid extends Component {
  static propTypes = {
    match: PropTypes.object,
    route: PropTypes.object
  };

  render() {
    const { route } = this.props;
    const routeName = _.hasIn(this.props, ['match', 'params', 'routeName']) ? this.props.match.params.routeName.replace("%2F", "/") : "";  
    const routeVerbs =
      route && routeName && route[routeName]
        ? Object.keys(route[routeName])
        : [];
    const arrayOfRequestMetrics = routeVerbs.reduce((acc, verbName) => {
      return [
        ...acc,
        ...getTimeSeriesOfNetChange(
          route,
          `${routeName}.${verbName}.requests`,
          camelize(`${verbName.toLowerCase()} ${routeName.slice(1)} Requests`)
        )
      ];
    }, []);
    const requestsPerSecondArr = mergeTimeSeries(arrayOfRequestMetrics);
    return (
      <div>
        <ResponsiveReactGridLayout
          breakpoints={{ lg: 1200, md: 996, sm: 768 }}
          cols={{ lg: 12, md: 8, sm: 4 }}
          rowHeight={60}
        >
          <div
            data-grid={{ x: 0, y: 0, w: 6, h: 9, minW: 3, minH: 4 }}
            key="routeRequestChart"
            style={{
              border: "solid",
              overflow: "hidden"
            }}
          >
            <GMLineChart
              timeSeries={requestsPerSecondArr}
              title={`Requests Per Second - ${routeName}`}
            />
          </div>
          {routeVerbs.map((verbName, index) => {
            return (
              <div
                data-grid={{ x: 6, y: 5, w: 2, h: 3, minW: 2, minH: 3 }}
                key={`${verbName}Stats`}
                style={{
                  border: "solid",
                  overflow: "hidden"
                }}
              >
                <div className="uk-card uk-card-small uk-card-body">
                  <h3 className="uk-card-title">{`${verbName} ${routeName}`}</h3>
                  <p>
                    Requests:{" "}
                    {getLatestAttribute(
                      route,
                      `${routeName}.${verbName}.requests`
                    )}
                  </p>
                  <p>
                    Status Code 2XX :{" "}
                    {getLatestAttribute(
                      route,
                      `${routeName}.${verbName}.status.2XX`
                    )}
                  </p>
                  <p>
                    Status Code 200 :{" "}
                    {getLatestAttribute(
                      route,
                      `${routeName}.${verbName}.status.200`
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

function mapStateToProps({ metrics: { route } }) {
  return { route };
}

export default connect(mapStateToProps)(SummaryGrid);
