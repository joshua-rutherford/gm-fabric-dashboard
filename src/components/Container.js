import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
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
        <Sidebar />
        <div className="uk-container uk-background-muted">
          <Navbar />
          {this.props.children}
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
