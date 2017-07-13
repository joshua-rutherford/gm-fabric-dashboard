import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import _ from 'lodash';
import {
  mergeTimeSeries,
  getLatestAttribute,
  getTimeSeriesOfNetChange,
  getRouteMetrics,
  getRouteTree
} from "../utils";
import GMLineChart from "./GMLineChart";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class SummaryGrid extends Component {
  static propTypes = {
    match: PropTypes.object,
    routeMetrics: PropTypes.object,
    routeTree: PropTypes.object
  }

  state = {
    requestsPerSecond: [],
    routeVerbs: [],
    selectedRoute: ''
  }

  componentWillMount() {
    this.updateState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(nextProps.routeMetrics, this.props.routeMetrics) || !_.isEqual(nextProps.routeTree, this.props.routeTree);
  }

  updateState({routeMetrics, routeTree}) {
    // Pull the selected route from React Router, replacing %2F with slashes
    const selectedRoute = _.hasIn(this.props, ['match', 'params', 'routeName']) ? this.props.match.params.routeName.replace("%2F", "/") : ""; 
    // Get the HTTP verbs used on the selected route
    const routeVerbs =
      routeTree && selectedRoute && routeTree[selectedRoute]
        ? (Object.keys(routeTree[selectedRoute]))
        : [];
    const arrayOfRequestMetrics = routeVerbs.map(routeVerb => (
        getTimeSeriesOfNetChange(
          routeMetrics,
          `route${selectedRoute}/${routeVerb}/requests`,
          `${routeVerb.toLowerCase()} ${selectedRoute.slice(1)} Requests`
        )
    ));
    this.setState({
      selectedRoute,
      requestsPerSecond: mergeTimeSeries(arrayOfRequestMetrics),
      routeVerbs
    });
  }

  render() {
    const { routeMetrics } = this.props;
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
              timeSeries={this.state.requestsPerSecond}
              title={`Requests Per Second - ${this.state.selectedRoute}`}
            />
          </div>
          {this.state.routeVerbs.map((verbName, index) => {
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
                  <h3 className="uk-card-title">{`${verbName} ${this.state.selectedRoute}`}</h3>
                  <p>
                    Requests:{" "}
                    {getLatestAttribute(
                      routeMetrics,
                      `route${this.state.selectedRoute}/${verbName}/requests`
                    )}
                  </p>
                  <p>
                    Status Code 2XX :{" "}
                    {getLatestAttribute(
                      routeMetrics,
                      `route${this.state.selectedRoute}/${verbName}/status/2XX`
                    )}
                  </p>
                  <p>
                    Status Code 200 :{" "}
                    {getLatestAttribute(
                      routeMetrics,
                      `route${this.state.selectedRoute}/${verbName}/status/200`
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

function mapStateToProps(state) {
  return {
    routeMetrics: getRouteMetrics(state),
    routeTree: getRouteTree(state)
  };
}

export default connect(mapStateToProps)(SummaryGrid);
