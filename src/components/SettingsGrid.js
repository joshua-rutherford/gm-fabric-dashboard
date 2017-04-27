import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import PollingSettings from './PollingSettings';
import UIkit from 'uikit';
import 'react-input-range/lib/css/index.css';
import { Actions } from 'jumpstate';

SettingsGrid.propTypes = {
  settings: PropTypes.object
};

function SettingsGrid ({settings}) {
  return (
    <div>
      <div
        className="uk-grid-match uk-grid-small uk-text-center"
        data-uk-grid
      >
        <div className="uk-width-1-2@m">
          <PollingSettings
            interval={settings.interval}
            isPolling={settings.isPolling} 
          />
        </div>
        <div className="uk-width-1-2@m">
          <div className="uk-card uk-card-default uk-card-body">
            <h3 className="uk-card-title">Metrics Cache</h3>
            <button
              className="uk-button uk-button-decipher"
              onClick={() => {
                UIkit.modal.confirm('Are you sure that you want to clear the cached metrics data? This action in irreversible.')
                  .then(() => Actions.clearMetrics());
              }}
              tabIndex={30}
            >Clear Metrics Cache</button>
          </div>
        </div>
      </div>
    </div>
  );
};


function mapStateToProps({ settings }) {
  return { settings };
};

export default connect(mapStateToProps)(SettingsGrid);
