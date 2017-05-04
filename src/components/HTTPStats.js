import React from 'react';
import { PropTypes } from 'prop-types';
import ms from 'ms';

HTTPStats.propTypes = {
  appUptime: PropTypes.number.isRequired,
  totalHTTPRequests: PropTypes.number.isRequired,
  totalSuccessfulHTTPRequests: PropTypes.number.isRequired
};

export default function HTTPStats({ appUptime, totalHTTPRequests, totalSuccessfulHTTPRequests }) {
  return (
    <div className="uk-card uk-card-small uk-card-body left-border">
      <h3 className="uk-card-title">HTTP Stats</h3>
      <p>Uptime: {ms(appUptime)} </p>
      <p>Total HTTP Requests: {totalHTTPRequests} </p>
      <p>Successful HTTP Requests: {totalSuccessfulHTTPRequests} </p>
    </div>
  );
}
