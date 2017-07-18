import React from "react";
import { PropTypes } from "prop-types";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import _ from "lodash";
import { extractDataAttributes } from "../utils";
import randomColor from "randomcolor";

/**
 * Reuseable Line Chart component for rendering a time series
 *
 * Required Props include title (the string to show at that top of the card) and time series (the data to render).
 * Optional props include any number of detailLines, an array of strings listed below the line chart.
 */
export default class GMLineChart extends React.Component {
  static propTypes = {
    detailLines: PropTypes.array,
    expectedAttributes: PropTypes.array,
    timeSeries: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
  };

  static defaultProps = {
    detailLines: []
  };

  state = {
    dataKeys: [],
    colors: {}
  };

  componentWillMount() {
    const dataKeys = extractDataAttributes(this.props.timeSeries);
    this.setState({
      dataKeys,
      colors: this.generateColors(dataKeys)
    });
  }

  componentWillReceiveProps(nextProps) {
    const dataKeys = extractDataAttributes(nextProps.timeSeries);
    if (!_.isEqual(dataKeys, this.state.dataKeys)) {
      this.setState({
        dataKeys,
        colors: this.generateColors(dataKeys)
      });
    }
  }

  /**
   * generateColors generates a random color associated for each data attribute.
   * The key value pairs are never cleaned up, but 
   * @param {String[]} dataKeys 
   * @param {Object} currentColorsState
   * @returns {Object}
   */
  generateColors(dataKeys, currentColorsState = this.state.colors) {
    const newColors = {};
    dataKeys.forEach(dataKey => {
      if (currentColorsState[dataKey]) {
        newColors[dataKey] = currentColorsState[dataKey];
      } else {
        newColors[dataKey] = randomColor();
      }
    });
    return newColors;
  }

  render() {
    const { colors, dataKeys } = this.state;
    const { detailLines, title, timeSeries } = this.props;

    return (
      <div className="uk-card uk-card-small uk-card-body">
        <h3 className="uk-card-title">
          {title}
        </h3>
        <ResponsiveContainer aspect={2} height="80%" width="100%">
          {this.props.timeSeries.length === 0
            ? <div>
                <div>No Data to Chart</div>
                {this.props.expectedAttributes &&
                  this.props.expectedAttributes.length > 0 &&
                  <div>
                    These expected metrics were not found:
                    <ul>
                      {this.props.expectedAttributes.map(attribute =>
                        <li key={attribute}>
                          {attribute}
                        </li>
                      )}
                    </ul>
                  </div>}
              </div>
            : <LineChart data={timeSeries}>
                {dataKeys.map(dataKey =>
                  <Line
                    dataKey={dataKey}
                    dot={false}
                    isAnimationActive={false}
                    key={dataKey}
                    name={dataKey}
                    stroke={colors[dataKey]}
                    type="monotone"
                  />
                )}
                <CartesianGrid stroke="#f2efef" />
                <XAxis
                  dataKey="prettyTime"
                  interval="preserveStartEnd"
                  minTickGap={10}
                  padding={{ left: 25 }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
              </LineChart>}
        </ResponsiveContainer>
        {detailLines.map(element =>
          <div key={element}>
            {element}
          </div>
        )}
      </div>
    );
  }
}
