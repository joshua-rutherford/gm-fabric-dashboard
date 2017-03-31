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
    // If this is the first snapshot, we don't have a basis of comparison to understand the net change, so just map the element to
    // an object with 0 up and 0 down.
    if (index === 0) {
      return {
        timestamp: prettyDate,
        kbpsDown: 0,
        kbpsUp: 0
      };
    } else if (
      // If either the current metrics snapshot or the previous metrics snapshot does not have the 'http/sent_bytes' attribute,
      // then we don't have two pieces of data to compare to determine the net change, so just map the element to an object with 0 up 
      // and 0 down. We assume that twitter-server populates both 'http/sent_bytes' and 'http/received_bytes' at effectively the same
      // time as part of a normal request/response cycle.
      !(Object.keys(metrics.data).includes('http/sent_bytes'))
      || !(Object.keys(metricsArr[index - 1].data).includes('http/sent_bytes'))
    ) {
      return {
        timestamp: prettyDate,
        kbpsDown: 0,
        kbpsUp: 0
      };
      // We finally have two metrics snapshots with the 'http/received_bytes' and 'http/sent_bytes' attributes, so we map to objects
      // with net change values, convert to KBps, and normalize over the interval.
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
