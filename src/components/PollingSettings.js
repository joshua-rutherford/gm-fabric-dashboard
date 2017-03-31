import React, { Component, PropTypes } from 'react';
import InputRange from 'react-input-range';
import _ from 'lodash';

class PollingSettings extends Component {
  static propTypes = {
    isPolling: PropTypes.bool.isRequired,
    setInterval: PropTypes.func.isRequired,
    togglePolling: PropTypes.func.isRequired
  }
  // This state is solely to allow smooth animation on the slider and the ability to debounce the 
  // dispatch of the setInterval action creator.
  state = {
    localInterval: 15,
    debouncedSetInterval: _.debounce(this.props.setInterval, 1000)
  }
  render() {
    return (
      <div className="uk-card uk-card-default uk-card-body">
        <h3 className="uk-card-title">Nonfunctional Dummy Settings</h3>
        <button
          className="uk-button"
          onClick={() => {
            this.props.togglePolling();
          }}
        >{this.props.isPolling ? 'Stop Polling' : 'Start Polling'}
        </button>
        <h4>Polling Interval (seconds)</h4>
        <InputRange
          maxValue={120}
          minValue={5}
          onChange={value => {
            this.setState({ localInterval: value });
            this.state.debouncedSetInterval(value * 1000);
          }}
          value={this.state.localInterval}
        />
      </div>
    );
  }
}

export default PollingSettings;
