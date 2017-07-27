import React from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import UIkit from "uikit";
import { Actions } from "jumpstate";
import PollingSettings from "./PollingSettings";
import "react-input-range/lib/css/index.css";

SettingsGrid.propTypes = {
  settings: PropTypes.object
};

function SettingsGrid({ settings }) {
  return (
    <div className="view-app-settings settings-grid">

      <PollingSettings
        interval={settings.interval}
        isPolling={settings.isPolling}
      />

      <section className="layout-section settings-group-metrics-cache">
        <header>
          <span data-uk-icon={`icon: grid; ratio: 1`} className="section-icon"/>
          <h3 className="section-title">Metrics Cache</h3>
        </header>

        <div className="section-content">

          <div className="control-group">
            <div className="readout">
              <span className="readout-text">162.12 MB</span>
              <span className="readout-label">Cache Size</span>
            </div>

            <button
              className="uk-button"
              onClick={() => {
                UIkit.modal
                  .confirm(
                    "Are you sure that you want to clear the cached metrics data? This action in irreversible."
                  )
                  .then(() => Actions.clearMetrics());
              }}
              tabIndex={30}
            >
              <span data-uk-icon={`icon: close; ratio: 1`} className="icon"/>
              <span className="label">Clear Metrics Cache</span>
            </button>
          </div>
        </div>
      </section>

      <section className="layout-section settings-group-user-dashboards">
        <header>
          <span data-uk-icon={`icon: grid; ratio: 1`} className="section-icon"/>
          <h3 className="section-title">Custom Dashboards</h3>
        </header>
        <div className="section-content">

          <div className="control-group control-group-clear-dashboards">
            <div className="readout">
              <span className="readout-text">0</span>
              <span className="readout-label">Custom Dashboards</span>
            </div>
            <button
              className="uk-button"
              onClick={() => {
                UIkit.modal
                  .confirm(
                    "Are you sure that you want to clear dashboard state? This will revert all dashboards to default."
                  )
                  .then(() => Actions.clearDashboards());
              }}
              tabIndex={31}
              disabled="disabled"
            >
              <span data-uk-icon={`icon: close; ratio: 1`} className="icon"/>
              <span className="label">Reset Dashboards</span>
            </button>

          </div>
        </div>
      </section>
    </div>
  );
}

function mapStateToProps({ settings }) {
  return { settings };
}

export default connect(mapStateToProps)(SettingsGrid);
