import React from 'react';
import { PropTypes } from 'prop-types';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

DataTxChart.propTypes = {
  receivedAndSentBytesPerSecondArr: PropTypes.array
};

export default function DataTxChart({ receivedAndSentBytesPerSecondArr }) {
  let deltas = [];
  if (receivedAndSentBytesPerSecondArr.length) {
    deltas = receivedAndSentBytesPerSecondArr.map(({ time, prettyTime, receivedBytesPerSecond, sentBytesPerSecond }) => ({
      time,
      prettyTime,
      receivedKilobytesPerSecond: Math.round(receivedBytesPerSecond / 1024),
      sentKilobytesPerSecond: Math.round(sentBytesPerSecond / 1024)
    }));
  }

  return (
    <div className="uk-card uk-card-small uk-card-body left-border">
      <h3 className="uk-card-title">Data Transfer Rates (KBps)</h3>
      {receivedAndSentBytesPerSecondArr.length ? (
        <ResponsiveContainer
          aspect={2}
          height="80%"
          width="100%"
        >
          <LineChart data={deltas}>
            <Line
              dataKey="receivedKilobytesPerSecond"
              dot={false}
              isAnimationActive={false}
              name="KBps Down"
              stroke="#ffc700"
              type="monotone"
            />
            <Line
              dataKey="sentKilobytesPerSecond"
              dot={false}
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
        </ResponsiveContainer>) :
        (<h4>Transfer Data Unavailable</h4>)
      }
    </div>
  );
}
