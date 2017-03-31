import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PollingSettings from './PollingSettings';
import UIkit from 'uikit';
import { clearMetrics, togglePolling, setInterval } from '../actions/index';
import 'react-input-range/lib/css/index.css';


const SettingsGrid = (props) => {
  return (
    <div>
      <div
        className="uk-grid-match uk-grid-small uk-text-center"
        data-uk-grid
      >
        <div className="uk-width-1-2@m">
          <PollingSettings 
            isPolling={props.settings.isPolling} 
            setInterval={props.setInterval} 
            togglePolling={props.togglePolling} 
          />
        </div>
        <div className="uk-width-1-2@m">
          <div className="uk-card uk-card-default uk-card-body">
            <h3 className="uk-card-title">Metrics Cache</h3>
            <button
              className="uk-button uk-button-danger"
              onClick={() => {
                UIkit.modal.confirm('Are you sure that you want to clear the cached metrics data? This action in irreversible.')
                  .then(() => props.clearMetrics());
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

SettingsGrid.propTypes = {
  clearMetrics: PropTypes.func.isRequired
};

function mapStateToProps({ settings }) {
  return { settings };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ clearMetrics, togglePolling, setInterval }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsGrid);
