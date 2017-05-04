import React from 'react';
import { PropTypes } from 'prop-types';

FinagleFuturePoolStats.propTypes = {
  activeTasks: PropTypes.number,
  completedTasks: PropTypes.number,
  poolSize: PropTypes.number
};

export default function FinagleFuturePoolStats({ activeTasks, completedTasks, poolSize }) {
  return (
    <div className="data-table">
      <h3 className="">Future Pool</h3>
      <table className='uk-table'>
        <tbody>
          <tr>
            <td>Active Tasks</td>
            <td>{activeTasks} </td>
          </tr>
          <tr>
            <td>Completed Tasks</td>
            <td>{completedTasks} </td>
          </tr>
          <tr>
            <td>Pool Size</td>
            <td>{poolSize} </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
