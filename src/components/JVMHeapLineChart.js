import React from 'react';
import { PropTypes } from 'prop-types';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

JVMHeapLineChart.propTypes = {
  maxHeap: PropTypes.number.isRequired,
  usedAndCommittedHeapArr: PropTypes.array.isRequired
};

export default function JVMHeapLineChart({ maxHeap, usedAndCommittedHeapArr }) {
  const BYTES_TO_MB = 1048576;
  // Map the metrics array and generate array of objects with an array of objects
  // with time stamps and the # of HTTP connections
  const maxHeapInMegabytes = maxHeap / BYTES_TO_MB;
  const httpConnections = usedAndCommittedHeapArr.map(obj => ({
    time: obj.time,
    prettyTime: obj.prettyTime,
    committedHeap: Math.round(obj.committed / BYTES_TO_MB),
    usedHeap: Math.round(obj.used / BYTES_TO_MB)
  }));


  const CustomizedYAxisTick = React.createClass({
    render () {
      const {x, y, stroke, payload} = this.props;

     	return (
      	<g transform={`translate(${x},${y})`}>
          <text x={-4} y={0} dy={0} textAnchor="end" fontSize="12" fontWeight="500" fill="#666">{payload.value} MB</text>
        </g>
        );
      }
    });

    const CustomizedXAxisTick = React.createClass({
      render () {
        const {x, y, stroke, payload} = this.props;

       	return (
        	<g transform={`translate(${x},${y})`}>
            <text x={0} y={16} dy={0} textAnchor="middle" fontSize="12" fontWeight="500" fill="#666">{payload.value}</text>
          </g>
          );
        }
      });

  return (
    <div className="uk-card uk-card-small uk-card-body">
      <h3 className="uk-card-title">Heap</h3>
      <ResponsiveContainer
        aspect={2}
        height="80%"
        width="100%"
      >
        <LineChart data={httpConnections}>
          <Line
            dataKey="committedHeap"
            dot={false}
            isAnimationActive={false}
            name="Committed Heap Size"
            stroke="#555"
            strokeWidth="2"
            type="monotone"
            unit=" MB"
          />
          <Line
            dataKey="usedHeap"
            dot={false}
            isAnimationActive={false}
            name="Used Heap Size"
            stroke="#0aab2a"
            strokeWidth="2"
            type="monotone"
            unit=" MB"
          />
        <CartesianGrid
          stroke="#eee"
          strokeWidth="1"
        />
          <XAxis
            dataKey="prettyTime"
            interval="preserveStartEnd"
            tickSize="1"
            minTickGap="16"
            tick={<CustomizedXAxisTick/>}
            axisLine={false}
            tickLine={false}
          />
          <YAxis allowDecimals={false}
            mirrored="true"
            tickSize="1"
            tick={<CustomizedYAxisTick/>}
            minTickGap="16"
            axisLine={false}
            tickLine={false}
           />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
      <div>Max Heap Size: {maxHeapInMegabytes} MB</div>
    </div>
  );
}
