import React from 'react';
import { PropTypes } from 'prop-types';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

HTTPConnectionsChart.propTypes = {
  connectionsArr: PropTypes.array.isRequired
};

export default function HTTPConnectionsChart({ connectionsArr }) {
  return (
    <div className="uk-card uk-card-small uk-card-body left-border">
      <h3 className="uk-card-title">HTTP Connections</h3>
      {connectionsArr.length ? (
        <ResponsiveContainer
          aspect={2}
          height="80%"
          width="100%"
        >
          <LineChart data={connectionsArr}>
            <Line
              dataKey="httpConnections"
              dot={false}
              isAnimationActive={false}
              name="# Active HTTP Connections"
              stroke="#339933"
              type="monotone"
            />
            <Line
              dataKey="httpsConnections"
              dot={false}
              isAnimationActive={false}
              name="# Active HTTPS Connections"
              stroke="#00cc66"
              type="monotone"
            />
            <CartesianGrid stroke="#f2efef" />
            <XAxis
              dataKey="prettyTime"
              interval="preserveStartEnd"
              minTickGap={10}
              padding={{ left: 25 }}
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <h4>HTTPS Connections Data Unavailable</h4>
        )}
    </div>
  );
}
