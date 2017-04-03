import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import PollingSettings from './PollingSettings';
import UIkit from 'uikit';
import 'react-input-range/lib/css/index.css';
import { Actions } from 'jumpstate';

SettingsGrid.propTypes = {
  settings: PropTypes.object.isRequired,
};

function SettingsGrid (props) {
  return (
    <div>
      <div
        className="uk-grid-match uk-grid-small uk-text-center"
        data-uk-grid
      >
        <div className="uk-width-1-2@m">
          <PollingSettings 
            interval={props.settings.interval}
            isPolling={props.settings.isPolling} 
          />
        </div>
        <div className="uk-width-1-2@m">
          <div className="uk-card uk-card-default uk-card-body">
            <h3 className="uk-card-title">Metrics Cache</h3>
            <button
              className="uk-button uk-button-danger"
              onClick={() => {
                UIkit.modal.confirm('Are you sure that you want to clear the cached metrics data? This action in irreversible.')
                  .then(() => Actions.clearMetrics());
              }}
            >Clear Metrics Cache</button>
          </div>
        </div>
        <div className="uk-width-1-2@m">
          <div className="uk-card uk-card-default uk-card-body">
            <h3 className="uk-card-title">Notification Settings</h3>
            <img
              alt="Fill Murray"
              src="https://placeimg.com/300/200/nature"
            />
          </div>
        </div>
        <div className="uk-width-1-2@m">
          <div className="uk-card uk-card-default uk-card-body">
            <h3 className="uk-card-title">Fauna Breeding</h3>
            <img
              alt="Fill Murray"
              src="https://placeimg.com/300/200/people"
            />
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
