import React from 'react';
import { PropTypes } from 'prop-types';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

JVMFileDescriptorAreaChart.propTypes = {
  fdCountArr: PropTypes.array.isRequired,
  fdLimit: PropTypes.number.isRequired,
};

export default function JVMFileDescriptorAreaChart({ fdCountArr, fdLimit }) {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">File Descriptors</h3>
      <ResponsiveContainer
        aspect={2}
        height="80%"
        width="90%"
      >
        <AreaChart data={fdCountArr}>
          <Area
            dataKey="fdCount"
            fill="#F3F3F3"
            isAnimationActive={false}
            name="Current File Descriptors"
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
      <div>File Descriptor Limit: {fdLimit}</div>
    </div>
  );
}
