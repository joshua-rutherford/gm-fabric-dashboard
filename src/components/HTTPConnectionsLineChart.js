import React, { PropTypes } from 'react';
import dateFormat from 'dateformat';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

HTTPConnectionsLineChart.propTypes = {
  metricsArr: PropTypes.array.isRequired
};

export default function HTTPConnectionsLineChart ({ metricsArr }) {

  // Map the metrics array and generate array of objects with an array of objects 
  // with time stamps and the # of HTTP connections
  const httpConnections = metricsArr.map(function (metrics) {
    const date = new Date(metrics.date);
    const prettyDate = dateFormat(date, "HH:MM:ss");
    return { name: prettyDate, httpConnections: metrics.data['http/connections'] };
  });

  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">HTTP Connections</h3>
      <ResponsiveContainer
        height="80%"
        width="90%"
      >
        <LineChart data={httpConnections}>
          <Line
            dataKey="httpConnections"
            isAnimationActive={false}
            name="# Active HTTP Connections"
            stroke="#8884d8"
            type="monotone"
          />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
