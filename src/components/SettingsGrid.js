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
    <div>
      <div
        className="uk-grid-match uk-grid-collapse uk-text-center"
        data-uk-grid
      >
        <div className="uk-width-1-3@m">
          <PollingSettings
            interval={settings.interval}
            isPolling={settings.isPolling}
          />
        </div>
        <div className="uk-width-1-3@m">
          <div className="uk-card uk-card-small uk-card-body">
            <h3 className="uk-card-title">Metrics Cache</h3>
            <button
              className="uk-button uk-button-decipher"
              onClick={() => {
                UIkit.modal
                  .confirm(
                    "Are you sure that you want to clear the cached metrics data? This action in irreversible."
                  )
                  .then(() => Actions.clearMetrics());
              }}
              tabIndex={30}
            >
              Clear Metrics Cache
            </button>
          </div>
        </div>
        <div className="uk-width-1-3@m">
          <div className="uk-card uk-card-small uk-card-body">
            <h3 className="uk-card-title">Dashboards</h3>
            <button
              className="uk-button uk-button-decipher"
              onClick={() => {
                UIkit.modal
                  .confirm(
                    "Are you sure that you want to clear dashboard state? This will revert all dashboards to default."
                  )
                  .then(() => Actions.clearDashboards());
              }}
              tabIndex={31}
            >
              Reset Dashboards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps({ settings }) {
  return { settings };
}

export default connect(mapStateToProps)(SettingsGrid);
