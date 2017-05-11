import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import JVMThreadsTable from './JVMThreadsTable';
import { Actions } from 'jumpstate';
import { connect } from 'react-redux';
import { getVisibleThreads, getThreadCounts } from '../utils';

class JVMThreadsSection extends Component {
  static propTypes = {
    threadCounts: PropTypes.object,
    threads: PropTypes.array
  }
  render() {
    const { threadCounts, threads } = this.props;
    return (
      <div className="">
        <div className="thread-table-filter-buttons uk-button-group">
          <button
            className="uk-button uk-button-default uk-button-small"
            disabled={!threadCounts.all}
            onClick={() => Actions.setThreadsFilter('all')}
            tabIndex={15}
          >
            <span className="uk-text-bold uk-text-capitalize">All Threads </span>
            <span className="uk-text-muted">{threadCounts.all}</span>
          </button>
          <span className="uk-button-group uk-margin-left">
            <button
              className="uk-button uk-button-default uk-button-small"
              disabled={!threadCounts.active}
              onClick={() => Actions.setThreadsFilter('active')}
              tabIndex={16}
            >
              <span className="uk-text-bold uk-text-capitalize">Active </span>
              <span className="uk-text-muted">{threadCounts.active}</span>
            </button>
            <button
              className="uk-button uk-button-default uk-button-small"
              disabled={!threadCounts.idle}
              onClick={() => Actions.setThreadsFilter('idle')}
              tabIndex={17}
            >
              <span className="uk-text-bold uk-text-capitalize">Idle </span>
              <span className="uk-text-muted">{threadCounts.idle}</span>
            </button>
            <button
              className="uk-button uk-button-default uk-button-small"
              disabled={!threadCounts.stopped}
              onClick={() => Actions.setThreadsFilter('stopped')}
              tabIndex={18}
            >
              <span className="uk-text-bold uk-text-capitalize">Stopped </span>
              <span className="uk-text-muted">{threadCounts.stopped}</span>
            </button>
          </span>
        </div>
        <JVMThreadsTable filteredThreadData={threads} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  threads: getVisibleThreads(state),
  threadCounts: getThreadCounts(state)
});

export default connect(mapStateToProps)(JVMThreadsSection);
