import React, { PropTypes } from 'react';
import ms from 'ms';

HTTPStats.propTypes = {
  metricsArr: PropTypes.array.isRequired
};

export default function HTTPStats({ metricsArr }) {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">HTTP Stats</h3>
      <p>Uptime: {metricsArr.length > 0 ? ms(metricsArr[metricsArr.length - 1].data['jvm/uptime'], { long: true }) : ''} </p>
      <p>Total HTTP Requests: {metricsArr.length > 0 ? metricsArr[metricsArr.length - 1].data['http/requests'] : ''} </p>
      <p>Successful HTTP Requests: {metricsArr.length > 0 ? metricsArr[metricsArr.length - 1].data['http/success'] : ''} </p>
    </div>
  );
}
