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
      ? "uk-button uk-button-vertical uk-button-danger"
      : "uk-button uk-button-vertical";
    const buttonIcon = isPolling ? "ban" : "play-circle";
    const buttonLabel = isPolling ? "Stop Polling" : "Resume Polling";
    return (
      <section className="layout-section settings-group-polling">
        <header>
          <span
            className="section-icon"
            data-uk-icon={`icon: grid; ratio: 1`}
          />
          <h3 className="section-title">
            {"Polling"}
          </h3>
        </header>
        <div className="section-content">
          <div className="control-group control-group-polling-start-stop">
            <button
              className={buttonClass}
              onClick={() => Actions.togglePolling()}
              tabIndex={20}
            >
              <span
                className="icon"
                data-uk-icon={`icon: ` + buttonIcon + `; ratio: 2`}
              />
              <span className="label">
                {buttonLabel}
              </span>
            </button>
          </div>

          <div className="control-group control-group-polling-interval">
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
            <span className="label" id="interval-name">
              {"Polling Interval (seconds)"}
            </span>
          </div>
        </div>
      </section>
    );
  }
}

export default PollingSettings;
