import React, { PropTypes } from 'react';
import dateFormat from 'dateformat';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

HTTPConnectionsLineChart.propTypes = {
  metricsArr: PropTypes.array.isRequired
};

export default function HTTPConnectionsLineChart({ metricsArr }) {
  // Filter the metrics array to find objects containing metrics.data['http/connections']
  const filteredMetricsArr = metricsArr.filter(metrics => metrics.data['http/connections']);

  if (filteredMetricsArr.length === 0) {
    return (
      <div className="uk-card uk-card-default uk-card-body">
        <h3 className="uk-card-title">HTTP Connections</h3>
        <p>Microservice has not yet been connected to</p>
      </div>
    );
  };

  // Map the metrics array and generate array of objects with an array of objects
  // with timestamps and the # of HTTP connections
  const httpConnections = filteredMetricsArr.map(function (metrics) {
    const date = new Date(metrics.date);
    const prettyDate = dateFormat(date, "h:MMtt");
    return { name: prettyDate, httpConnections: metrics.data['http/connections'] };
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
