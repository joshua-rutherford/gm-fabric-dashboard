import React, { Component, PropTypes } from 'react';
import JSONTree from 'react-json-tree';
import { connect } from 'react-redux';

class JSONComponent extends Component {
  static propTypes = {
    metrics: PropTypes.object
  };

  render() {
    const { metrics } = this.props;
    return (
      <div>
        <JSONTree
          data={metrics}
          invertTheme={true}
          theme={{
            base00: "#000",
            base01: "#e1e1e2",
            base02: "#c4c3c5",
            base03: "#a7a5a8",
            base04: "#89878b",
            base05: "#6c696e",
            base06: "#4f4b51",
            base07: "#322d34",
            base08: "#d8137f",
            base09: "#d65407",
            base0A: "#dc8a0e",
            base0B: "#17ad98",
            base0C: "#149bda",
            base0D: "#775dff",
            base0E: "#aa17e6",
            base0F: "#e013d0"
          }}
        />
      </div>
    );
  };
};

function mapStateToProps({ metrics }) {
  return { metrics };
};

export default connect(mapStateToProps)(JSONComponent);
