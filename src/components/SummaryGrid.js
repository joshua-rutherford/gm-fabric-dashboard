import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { getLatestAttribute } from "../utils";
import dateFormat from "dateformat";
import ms from "ms";

class SummaryGrid extends Component {
  static propTypes = {
    metrics: PropTypes.object
  };
  render() {
    const { metrics } = this.props;
    return (
      <div className="uk-section uk-section-default">
        <div
          className="uk-grid-small uk-child-width-1-2@s"
          data-uk-grid
          id="summary-grid"
        >
          <div className="uk-panel">
            <h3>Essentials</h3>
            <hr />
            <div className="summary-grid-title">Start Time</div>
            <div>
              {dateFormat(getLatestAttribute(metrics, "jvm/start_time"))}
            </div>
            <div className="summary-grid-title">Uptime</div>
            <div>
              {ms(getLatestAttribute(metrics, "jvm/uptime"))}
            </div>
          </div>
          <div className="uk-panel">
            <h3>Details</h3>
            <hr />
            <div className="summary-grid-title">Processor Cores</div>
            <div>
              {getLatestAttribute(metrics, "jvm/num_cpus")}
            </div>
            <div className="summary-grid-title">IP Address or Domain Name</div>
            <div>{`${window.location.hostname}:${window.location.port}`}</div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ metrics }) {
  return { metrics };
}

export default connect(mapStateToProps)(SummaryGrid);
