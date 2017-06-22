import React from 'react';
import { PropTypes } from 'prop-types';

HTTPStats.propTypes = {
  totalHTTPRequests: PropTypes.number.isRequired,
  totalHTTPSRequests: PropTypes.number.isRequired,
  totalSuccessfulHTTPRequests: PropTypes.number.isRequired,
  totalSuccessfulHTTPSRequests: PropTypes.number.isRequired
};

export default function HTTPStats({ totalHTTPRequests, totalHTTPSRequests, totalSuccessfulHTTPRequests, totalSuccessfulHTTPSRequests }) {
  return (
    <div className="uk-card uk-card-small uk-card-body left-border">
      <h3 className="uk-card-title">HTTP Stats</h3>
      <table className="uk-table uk-table-justify">
        <thead>  
          <tr>
            <th/>
            <th>Requests</th>
            <th>Success</th>
          </tr>
        </thead>  
        <tr>
          <td>HTTP</td>  
          <td>{totalHTTPRequests}</td>
          <td>{totalSuccessfulHTTPRequests}</td>
        </tr>
        <tr>
          <td>HTTPS</td>  
          <td>{totalHTTPSRequests}</td>
          <td>{totalSuccessfulHTTPSRequests}</td>
        </tr>
      </table>  
    </div>
  );
}
