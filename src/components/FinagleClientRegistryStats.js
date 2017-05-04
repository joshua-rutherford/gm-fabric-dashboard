import React from 'react';
import { PropTypes } from 'prop-types';

FinagleClientRegistryStats.propTypes = {
  initialResolution: PropTypes.number,
  size: PropTypes.number
};

export default function FinagleClientRegistryStats({ initialResolution, size }) {
  return (
    <div className="data-table">
      <h3 className="">Client Registry</h3>
      <table className='uk-table'>
        <tbody>
          <tr>
            <td>Initial Resolution</td>
            <td>{initialResolution}ms </td>
          </tr>
          <tr>
            <td>Size</td>
            <td>{size} </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
