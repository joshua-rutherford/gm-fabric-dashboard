import React, { PropTypes } from 'react';
import dateFormat from 'dateformat';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

JVMHeapLineChart.propTypes = {
  metricsArr: PropTypes.array.isRequired
};

export default function JVMHeapLineChart({ metricsArr }) {
  const BYTES_TO_MB = 1048576;
  // Map the metrics array and generate array of objects with an array of objects
  // with timestamps and the # of HTTP connections
  const maxHeap = metricsArr.length > 0 ? metricsArr[metricsArr.length - 1].data['jvm/heap/max'] / BYTES_TO_MB : 0;
  const httpConnections = metricsArr.map(function (metrics) {
    const date = new Date(metrics.date);
    const prettyDate = dateFormat(date, "h:MMtt");
    return {
      timestamp: prettyDate,
      committedHeap: Math.round(metrics.data['jvm/heap/committed'] / BYTES_TO_MB),
      usedHeap: Math.round(metrics.data['jvm/heap/used'] / BYTES_TO_MB)
    };
  });

  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">JVM Heap</h3>
      <ResponsiveContainer
        height="80%"
        width="90%"
      >
        <LineChart data={httpConnections}>
          <Line
            dataKey="committedHeap"
            isAnimationActive={false}
            name="Committed Heap Size"
            stroke="#ffc700"
            type="monotone"
          />
          <Line
            dataKey="usedHeap"
            isAnimationActive={false}
            name="Used Heap Size"
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
      <div>Max Heap Size: {maxHeap} MB</div>
    </div>
  );
}
