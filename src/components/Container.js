import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Navbar from './Navbar';
import OffCanvasSidebar from './OffCanvasSidebar';
import OnCanvasSidebar from './OnCanvasSidebar';
import { Actions } from 'jumpstate';

class Container extends Component {
  static propTypes = {
    children: PropTypes.any,
    metricsEndpoints: PropTypes.array
  }

  // Perform an initial fetch of metrics on mount.
  // This triggers hooks which initialize polling using the default parameters
  componentDidMount() {
    Actions.fetchMetrics(this.props.metricsEndpoints);
  }

  render() {
    return (
      <div className="uk-offcanvas-content">
        <OffCanvasSidebar />
        <div
          className="uk-container uk-container-expand"
          id="app-container"
        >
          <Navbar />
          <div
            className="uk-background-default"
            data-uk-grid
            data-uk-grid-margin
          >
            <div className="uk-width-1-5@m uk-width-1-6@l uk-visible@m uk-tile uk-tile-default on-canvas-sidebar">
              <OnCanvasSidebar />
            </div>
            <main className="uk-width-4-5@m uk-width-5-6@l">
              {this.props.children}
            </main>
          </div>
        </div>
      </div>
    );
  };
}

function mapStateToProps({ settings: { metricsEndpoints } }) {
  return { metricsEndpoints };
};

export default connect(mapStateToProps)(Container);
