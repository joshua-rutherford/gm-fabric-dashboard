import React from 'react';
import { PropTypes } from 'prop-types';

FinagleClientRegistryStats.propTypes = {
  initialResolution: PropTypes.number,
  size: PropTypes.number
};

export default function FinagleClientRegistryStats({ initialResolution, size }) {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">Client Registry</h3>
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
