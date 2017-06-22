import React from 'react';
import { PropTypes } from 'prop-types';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

RouteRequestChart.propTypes = {
  requestsPerSecondArr: PropTypes.array.isRequired,
  routeName: PropTypes.string.isRequired,
  verbName: PropTypes.string.isRequired
};

export default function RouteRequestChart({ routeName, verbName, requestsPerSecondArr }) {
  return (

    <div className="uk-card uk-card-small uk-card-body">
      <h3 className="uk-card-title">{`${verbName} ${routeName}`}</h3>
      <ResponsiveContainer
        aspect={2}
        height="80%"
        width="100%"
      >
        <AreaChart data={requestsPerSecondArr}>
          <Area
            dataKey="requestsPerSecond"
            fill="#F3F3F3"
            isAnimationActive={false}
            name={`${verbName} requests to ${routeName} per second`}
            stroke="#aaaaaa"
            type="monotone"
          />
          <CartesianGrid stroke="#f2efef" />
          <XAxis
            dataKey="prettyTime"
            interval="preserveStartEnd"
            padding={{ left: 25 }}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
