import React, { Component, PropTypes } from 'react';
import InputRange from 'react-input-range';
import _ from 'lodash';
import { Actions } from 'jumpstate';

class PollingSettings extends Component {
  // This state is solely to allow smooth animation on the slider and the ability to debounce the 
  // dispatch of the setInterval action creator.

  static propTypes = {
    interval: PropTypes.number.isRequired,
    isPolling: PropTypes.bool.isRequired
  }

  state = {
    localInterval: this.props.interval / 1000,
    debouncedSetInterval: _.debounce(Actions.setInterval, 1000)
  }
  render() {
    const {isPolling} = this.props;
    const buttonClass = isPolling ? 'uk-button uk-button-danger' : 'uk-button uk-button-primary';
    return (
      <div className="uk-card uk-card-default uk-card-body">
        <h3 className="uk-card-title">Polling</h3>
        <button
          className={buttonClass}
          onClick={() => Actions.togglePolling()}
        >{isPolling ? 'Stop Polling' : 'Start Polling'}
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
