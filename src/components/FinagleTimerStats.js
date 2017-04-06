import React, { PropTypes } from 'react';
import ms from 'ms';

FinagleTimerStats.propTypes = {
  timerDeviationAverage: PropTypes.number,
  timerDeviationCount: PropTypes.number,
  timerDeviationMax: PropTypes.number,
  timerDeviationMin: PropTypes.number,
  timerDeviationSum: PropTypes.number
};

export default function FinagleTimerStats({ timerDeviationAverage, timerDeviationCount, timerDeviationMax, timerDeviationMin, timerDeviationSum }) {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">Timer Deviation</h3>
      <table className='uk-table'>
        <tbody>
          <tr>
            <td>Count</td>
            <td>{timerDeviationCount} </td>
          </tr>
          <tr>
            <td>Average</td>
            <td>{Math.round(timerDeviationAverage)}ms </td>
          </tr>
          <tr>
            <td>Max</td>
            <td>{timerDeviationMax}ms </td>
          </tr>
          <tr>
            <td>Min</td>
            <td>{timerDeviationMin}ms </td>
          </tr>
          <tr>
            <td>Sum</td>
            <td>{ms(timerDeviationSum)} </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
