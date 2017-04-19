import React from 'react';
import { PropTypes } from 'prop-types';

FinaglePendingTasksStats.propTypes = {
  pendingTasksAverage: PropTypes.number,
  pendingTasksCount: PropTypes.number,
  pendingTasksMax: PropTypes.number,
  pendingTasksMin: PropTypes.number,
  pendingTasksSum: PropTypes.number
};

export default function FinaglePendingTasksStats({ pendingTasksAverage, pendingTasksCount, pendingTasksMax, pendingTasksMin, pendingTasksSum }) {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">Pending Timer Tasks</h3>
      <table className='uk-table'>
        <tbody>
          <tr>
            <td>Count</td>
            <td>{pendingTasksCount} </td>
          </tr>
          <tr>
            <td>Average</td>
            <td>{Math.round(pendingTasksAverage)} </td>
          </tr>
          <tr>
            <td>Max</td>
            <td>{pendingTasksMax} </td>
          </tr>
          <tr>
            <td>Min</td>
            <td>{pendingTasksMin} </td>
          </tr>
          <tr>
            <td>Sum</td>
            <td>{pendingTasksSum} </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
