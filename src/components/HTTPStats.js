import React, { PropTypes } from 'react';
import ms from 'ms';

HTTPStats.propTypes = {
  appUptime: PropTypes.number.isRequired,
  totalHTTPRequests: PropTypes.number.isRequired,
  totalSuccessfulHTTPRequests: PropTypes.number.isRequired
};

export default function HTTPStats({ appUptime, totalHTTPRequests, totalSuccessfulHTTPRequests }) {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">HTTP Stats</h3>
      <p>Uptime: {ms(appUptime)} </p>
      <p>Total HTTP Requests: {totalHTTPRequests} </p>
      <p>Successful HTTP Requests: {totalSuccessfulHTTPRequests} </p>
    </div>
  );
}
