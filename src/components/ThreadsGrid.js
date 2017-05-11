import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import JVMThreadsSection from './JVMThreadsSection';

class ThreadsGrid extends Component {
  static propTypes = {
    threadsTable: PropTypes.array
  };
  render() {
    const { threadsTable } = this.props;
    return (
      <div className="thread-table-container">
        <div className="" data-uk-grid >
          <div className="uk-width-1-1@m">
            <JVMThreadsSection threadsTable={threadsTable} />
          </div>
        </div>
      </div>
    );
  };
};

function mapStateToProps({ metrics: { threadsTable } }) {
  return { threadsTable };
};

export default connect(mapStateToProps)(ThreadsGrid);
