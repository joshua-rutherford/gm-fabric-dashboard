import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

class SummaryGrid extends Component {
  static propTypes = {
    jvm: PropTypes.object
  }
  render() {
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
            <div className="summary-grid-title">Name</div>
            <div>0000000001</div>
            <div className="summary-grid-title">Health State</div>
            <div>Healthy</div>
            <div className="summary-grid-title">Status</div>
            <div>Up</div>
            <div className="summary-grid-title">Type</div>
            <div>Instance</div>
            <div className="summary-grid-title">Upgrade Domain</div>
            <div>0</div>
            <div className="summary-grid-title">Fault Domain</div>
            <div>fd:/0</div>
            <div className="summary-grid-title">IP Address or Domain Name</div>
            {`${window.location.hostname}:${window.location.port}`}
            <div className="summary-grid-title">IS Seed Instance</div>
            <div>True</div>
          </div>
          <div className="uk-panel">
            <h3>Details</h3>
            <hr />
            <div className="summary-grid-title">ID</div>
            <div>System/ActivityStreamService</div>
            <div className="summary-grid-title">Service Kind</div>
            <div>Stateful</div>
            <div className="summary-grid-title">Name</div>
            <div>fabric:/System/ActivityStreamService</div>
            <div className="summary-grid-title">Manifest Version</div>
            <div>5.1.150.9590</div>
            <div className="summary-grid-title">Has Persisted State</div>
            <div>True</div>
            <div className="summary-grid-title">Service Status</div>
            <div>Active</div>
            <div className="summary-grid-title">IS Service Group</div>
            <div>False</div>
          </div>
        </div>
      </div>
    );
  };
};

function mapStateToProps({ metrics: { jvm } }) {
  return { jvm };
};

export default connect(mapStateToProps)(SummaryGrid);
