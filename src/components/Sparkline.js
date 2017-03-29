import React, { PropTypes } from 'react';
import { Sparklines, SparklinesLine, SparklinesReferenceLine } from 'react-sparklines';

Sparkline.propTypes = {
  color: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  unit: PropTypes.string.isRequired
};

export default function Sparkline (props) {
  const data = props.data.length > 0 ? props.data : [0, 0];
  const numericAvg = average(data);
  return (
    <div>
      <Sparklines data={data}>
        <SparklinesLine color={props.color} />
        <SparklinesReferenceLine type="avg" />
      </Sparklines>
      <p> {numericAvg} {props.unit} on average</p>
      <p> {data[data.length-1]} {props.unit} right now</p>
    </div>
  );
}

function average(data) {
  return Math.round(data.reduce((acc, val)=> acc + val) / data.length);
}
