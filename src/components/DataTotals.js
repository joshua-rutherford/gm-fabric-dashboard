import React from 'react';
import { PropTypes } from 'prop-types';
import filesize from 'filesize';

DataTotals.propTypes = {
  receivedBytes: PropTypes.number.isRequired,
  sentBytes: PropTypes.number.isRequired
};

export default function DataTotals({ receivedBytes, sentBytes }) {
  return (


    <div className="uk-panel">
      <h3 className="uk-card-title">Data Totals</h3>
      <div className="summary-grid-title">
        <i data-uk-icon="icon: upload; ratio: 2" />
        Uploaded
      </div>
      <div className="uk-text-large">{filesize(receivedBytes)}</div>
      <div className="summary-grid-title">
        <i data-uk-icon="icon: download; ratio: 2" />
        Downloaded
      </div>
      <div className="uk-text-large">{filesize(sentBytes)}</div>
    </div>
  );
}
