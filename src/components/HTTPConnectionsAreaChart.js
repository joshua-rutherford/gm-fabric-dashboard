import React from 'react';
import { PropTypes } from 'prop-types';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

HTTPConnectionsLineChart.propTypes = {
  connectionsArr: PropTypes.array.isRequired
};

export default function HTTPConnectionsLineChart({ connectionsArr }) {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">HTTP Connections</h3>
      {connectionsArr.length ? (
        <ResponsiveContainer
          aspect={2}
          height="80%"
          width="90%"
        >
          <AreaChart data={connectionsArr}>
            <Area
              dataKey="connections"
              fill="#F3F3F3"
              isAnimationActive={false}
              name="# Active HTTP Connections"
              stroke="#aaaaaa"
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
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <h4>HTTP Connections Data Unavailable</h4>
        )}
    </div>
  );
}
