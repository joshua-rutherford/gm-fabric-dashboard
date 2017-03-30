import React, { PropTypes } from 'react';
import dateFormat from 'dateformat';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

DataTxLineChart.propTypes = {
  metricsArr: PropTypes.array.isRequired
};

export default function DataTxLineChart({ metricsArr }) {

  // to derive the "per second" value, I need the refresh interval to live in the Redux store
  const INTERVAL_HACK = 5;
  // Map the metrics array and generate array of objects with an array of objects
  // with timestamps and the net change since the last metrics snapshot. The initial snapshot
	// is considered a net change of zero
  const deltas = metricsArr.map(function (metrics, index) {
    const date = new Date(metrics.date);
    const prettyDate = dateFormat(date, "h:MMtt");
    if (index === 0) {
      return {
        timestamp: prettyDate,
        bpsDown: 0,
        bpsUp: 0
      };
    } else {
      return {
        timestamp: prettyDate,
        kbpsDown: Math.round((metrics.data['http/received_bytes'] - metricsArr[index - 1].data['http/received_bytes']) / INTERVAL_HACK / 1024),
        kbpsUp: Math.round((metrics.data['http/sent_bytes'] - metricsArr[index - 1].data['http/sent_bytes']) / INTERVAL_HACK / 1024)
      };
    }
  });

  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">Data Transfer Rates (KBps)</h3>
      <ResponsiveContainer
        height="80%"
        width="90%"
      >
        <LineChart data={deltas}>
          <Line
            dataKey="kbpsDown"
            isAnimationActive={false}
            name="KBps Down"
            stroke="#ffc700"
            type="monotone"
          />
          <Line
            dataKey="kbpsUp"
            isAnimationActive={false}
            name="KBps Up"
            stroke="#00a1ff"
            type="monotone"
          />
          <CartesianGrid stroke="#ccc" />
          <XAxis
            dataKey="timestamp"
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
