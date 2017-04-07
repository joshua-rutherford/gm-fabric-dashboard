import React, { PropTypes } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

DataTxLineChart.propTypes = {
  receivedAndSentBytesPerSecondArr: PropTypes.array
};

export default function DataTxLineChart({ receivedAndSentBytesPerSecondArr }) {
  const deltas = receivedAndSentBytesPerSecondArr.map(({ time, prettyTime, receivedBytesPerSecond, sentBytesPerSecond }) => ({
    time,
    prettyTime,
    receivedKilobytesPerSecond: Math.round(receivedBytesPerSecond / 1024),
    sentKilobytesPerSecond: Math.round(sentBytesPerSecond / 1024)
  }));

  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">Data Transfer Rates (KBps)</h3>
      <ResponsiveContainer
        aspect={2}
        height="80%"
        width="90%"
      >
        <LineChart data={deltas}>
          <Line
            dataKey="receivedKilobytesPerSecond"
            isAnimationActive={false}
            name="KBps Down"
            stroke="#ffc700"
            type="monotone"
          />
          <Line
            dataKey="sentKilobytesPerSecond"
            isAnimationActive={false}
            name="KBps Up"
            stroke="#00a1ff"
            type="monotone"
          />
          <CartesianGrid stroke="#ccc" />
          <XAxis
            dataKey="prettyTime"
            interval="preserveStartEnd"
            padding={{ left: 25 }}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}