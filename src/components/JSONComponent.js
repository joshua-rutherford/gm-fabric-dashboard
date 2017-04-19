import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Inspector from 'react-json-inspector';
import { connect } from 'react-redux';

class JSONComponent extends Component {
  static propTypes = {
    metrics: PropTypes.object
  };

  render() {
    const { metrics } = this.props;
    return (
      <div
        className="uk-section"
      >
        <div
          className="uk-container"
          id="json-inspector-container"
        >
          <div data-uk-grid>
            <Inspector
              data={metrics}
              id="json-inspector"
              tabIndex={20}
            />
          </div>
        </div>
      </div>
    );
  };
};

function mapStateToProps({ metrics }) {
  return { metrics };
};

export default connect(mapStateToProps)(JSONComponent);
