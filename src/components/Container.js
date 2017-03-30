import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Navbar from './Navbar';
import OffCanvasSidebar from './OffCanvasSidebar';
import OnCanvasSidebar from './OnCanvasSidebar';
import { fetchMetrics } from '../actions/index';

class Container extends Component {

  componentDidMount() {
    // Currently we are refreshing the metrics every 15 secs.
    // This should be configurable in the future
    this.props.fetchMetrics();
    this.refreshMetrics = setInterval(this.props.fetchMetrics, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.refreshMetrics);
  }

  render() {
    return (
      <div>
        <OffCanvasSidebar />
        <div className="uk-container uk-container-expand ">
          <Navbar />
          <div
            className="uk-background-muted"
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

Container.propTypes = {
  fetchMetrics: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchMetrics }, dispatch);
}

export default connect(null, mapDispatchToProps)(Container);
