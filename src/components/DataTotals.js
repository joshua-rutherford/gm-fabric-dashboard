import React from "react";
import { PropTypes } from "prop-types";
import filesize from "filesize";

DataTotals.propTypes = {
  receivedBytes: PropTypes.number.isRequired,
  sentBytes: PropTypes.number.isRequired
};

export default function DataTotals({ receivedBytes, sentBytes }) {
  return (
    <div className="uk-card uk-card-small uk-card-body left-border">
      <h3 className="uk-card-title">Data Totals</h3>
      <div>
        <i data-uk-icon="icon: upload; ratio: 2" />
        <span className="uk-text-large">
          {" "}{filesize(receivedBytes)}{" "}
        </span>
      </div>
      <div>
        <i data-uk-icon="icon: download; ratio: 2" />
        <span className="uk-text-large">
          {" "}{filesize(sentBytes)}{" "}
        </span>
      </div>
    </div>
  );
}
