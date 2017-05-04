import React from 'react';
import { PropTypes } from 'prop-types';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

JVMHeapLineChart.propTypes = {
  currentLoadedArr: PropTypes.array.isRequired,
  totalLoaded: PropTypes.number.isRequired,
  totalUnloaded: PropTypes.number.isRequired
};

export default function JVMHeapLineChart({ currentLoadedArr, totalLoaded, totalUnloaded }) {
  return (
    <div className="uk-card uk-card-small uk-card-body">
      <h3 className="uk-card-title">Classes</h3>
      <ResponsiveContainer
        aspect={2}
        height="80%"
        width="100%"
      >
        <AreaChart data={currentLoadedArr}>
          <Area
            dataKey="currentLoaded"
            dot={false}
            fill="#F3F3F3"
            isAnimationActive={false}
            name="Current Loaded Classes"
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
      <div>Total Loaded: {totalLoaded}</div>
      <div>Total Unloaded: {totalUnloaded}</div>
    </div>
  );
}
