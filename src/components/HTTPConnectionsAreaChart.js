import React, { PropTypes } from 'react';
import dateFormat from 'dateformat';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

HTTPConnectionsLineChart.propTypes = {
  metricsArr: PropTypes.array.isRequired
};

export default function HTTPConnectionsLineChart({ metricsArr }) {
  // Map the metrics array and generate array of objects with an array of objects
  // with time stamps and the # of HTTP connections
  const httpConnections = metricsArr.map(function (metrics) {
    const date = new Date(metrics.date);
    const prettyDate = dateFormat(date, "h:MMtt");
    return {
      name: prettyDate,
      // If `http/connections` isn't present in metrics.json, assume it equals 0
      httpConnections: Object.keys(metrics.data).includes('http/connections') ? metrics.data['http/connections'] : 0
    };
  });

  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">HTTP Connections</h3>
      <ResponsiveContainer
        height="80%"
        width="90%"
      >
        <AreaChart data={httpConnections}>
          <Area
            dataKey="httpConnections"
            fill="#F3F3F3"
            isAnimationActive={false}
            name="# Active HTTP Connections"
            stroke="#aaaaaa"
            type="monotone"
          />
          <CartesianGrid stroke="#f2efef" />
          <XAxis
            dataKey="name"
            interval="preserveStartEnd"
            minTickGap={10}
            padding={{ left: 25 }}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
