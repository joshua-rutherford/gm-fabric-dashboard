import React, { Component } from "react";
import { PropTypes } from "prop-types";
import InputRange from "react-input-range";
import _ from "lodash";
import { Actions } from "jumpstate";

class PollingSettings extends Component {
  // This state is solely to allow smooth animation on the slider and the ability to debounce the
  // dispatch of the setInterval action creator.

  static propTypes = {
    interval: PropTypes.number.isRequired,
    isPolling: PropTypes.bool.isRequired
  };

  state = {
    localInterval: this.props.interval / 1000,
    debouncedSetInterval: _.debounce(Actions.setInterval, 1000)
  };

  render() {
    const { isPolling } = this.props;
    const buttonClass = isPolling
      ? "uk-button uk-button-danger"
      : "uk-button uk-button-decipher";
    return (
      <div className="uk-card uk-card-small uk-card-body">
        <h3 className="uk-card-title" id="polling">
          Polling
        </h3>
        <button
          className={buttonClass}
          onClick={() => Actions.togglePolling()}
          tabIndex={20}
        >
          {isPolling ? "Stop Polling" : "Start Polling"}
        </button>
        <h4 id="interval-name">Interval (seconds)</h4>
        <InputRange
          aria-labelledby="polling interval-name"
          maxValue={120}
          minValue={5}
          onChange={value => {
            this.setState({ localInterval: value });
            this.state.debouncedSetInterval(value * 1000);
          }}
          tabIndex={21}
          value={this.state.localInterval}
        />
      </div>
    );
  }
}

export default PollingSettings;
