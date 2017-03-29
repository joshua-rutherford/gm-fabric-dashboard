import React, { PropTypes } from 'react';
import filesize from 'filesize';

DataTotals.propTypes = {
  metricsArr: PropTypes.array.isRequired
};

export default function DataTotals({ metricsArr }) {

  const getSize = (key) => {
    // If the metrics array isn't empty and the most recent metrics snapshot contains the key we want
    // return the pretty formatted size metric. Otherwise return "0 bytes"
    if (metricsArr.length > 0 && metricsArr[metricsArr.length - 1].data[key]) {
      return filesize(metricsArr[metricsArr.length - 1].data[key]);
    } else {
      return "0 bytes";
    }
  };

  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">Data Totals</h3>
      <div>
        <i data-uk-icon="icon: upload; ratio: 2" />
        <span className="uk-text-large"> {getSize('http/sent_bytes')} </span>
      </div>
      <div>
        <i data-uk-icon="icon: download; ratio: 2" />
        <span className="uk-text-large"> {getSize('http/received_bytes')} </span>
      </div>
    </div>
  );
}
