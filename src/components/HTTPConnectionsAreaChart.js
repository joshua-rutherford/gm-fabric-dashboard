import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Styler, ChartContainer, Resizable, ChartRow, YAxis, Charts, LineChart } from 'react-timeseries-charts';

// HTTPConnectionsAreaChart.propTypes = {
//   connectionsTimeSeries: PropTypes.oneOf([
//     PropTypes.object,
//     PropTypes.bool
//   ])
// };

// const styler = Styler([
//   { key: "connections", color: "#2ca02c", width: 1 },
//   { key: "requests", color: "#9467bd", width: 2 }
// ]);

export default class HTTPConnectionsAreaChart extends Component {
  render() {
    const { connectionsTimeSeries, requestsTimeSeries } = this.props;
    console.log(requestsTimeSeries);
    if (!connectionsTimeSeries || !connectionsTimeSeries.timerange() || !requestsTimeSeries || !requestsTimeSeries.timerange()) {
      return (
        <div className="uk-card uk-card-default uk-card-body">
          <h3 className="uk-card-title">HTTP Connections</h3>
        </div>
      );
    } else {
      return (
        <div className="uk-card uk-card-default uk-card-body">
          <h3 className="uk-card-title">HTTP Connections</h3>
          <Resizable>
            <ChartContainer timeRange={connectionsTimeSeries.timerange()}>
              <ChartRow height="300">
                <YAxis
                  id="axis"
                  label="HTTP Connections"
                  max={10}
                  min={0}
                  type="linear"
                />
                <Charts>
                  <LineChart
                    axis="axis"
                    key="connections"
                    series={connectionsTimeSeries}
                  />
                  <LineChart
                    axis="axis2"
                    key="requests"
                    series={requestsTimeSeries}
                  />
                </Charts>
                <YAxis
                  id="axis2"
                  key="requests"
                  label="Requests per Second"
                  max={10}
                  min={0}
                  type="linear"
                />
              </ChartRow>
            </ChartContainer>
          </Resizable>
        </div>
      );
    }
  }
}

// import React from 'react';
// import {PropTypes} from 'prop-types';
// import {AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// HTTPConnectionsLineChart.propTypes = {
//   connectionsArr: PropTypes.array.isRequired
// };

// export default function HTTPConnectionsLineChart({ connectionsArr }) {
//   return (
//     <div className="uk-card uk-card-default uk-card-body">
//       <h3 className="uk-card-title">HTTP Connections</h3>
//       {connectionsArr.length ? (
//         <ResponsiveContainer
//           aspect={2}
//           height="80%"
//           width="90%"
//         >
//           <AreaChart data={connectionsArr}>
//             <Area
//               dataKey="connections"
//               fill="#F3F3F3"
//               isAnimationActive={false}
//               name="# Active HTTP Connections"
//               stroke="#aaaaaa"
//               type="monotone"
//             />
//             <CartesianGrid stroke="#f2efef" />
//             <XAxis
//               dataKey="prettyTime"
//               interval="preserveStartEnd"
//               minTickGap={10}
//               padding={{ left: 25 }}
//             />
//             <YAxis allowDecimals={false} />
//             <Tooltip />
//           </AreaChart>
//         </ResponsiveContainer>
//       ) : (
//         <h4>HTTP Connections Data Unavailable</h4>
//         )}
//     </div>
//   );
// }
