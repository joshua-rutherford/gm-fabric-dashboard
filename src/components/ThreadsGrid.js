import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import JVMThreadsTable from './JVMThreadsTable';

class SummaryGrid extends Component {
  static propTypes = {
    threadsTable: PropTypes.array
  };
  render() {
    const { threadsTable } = this.props;
    return (
      <div>
        <div
          className="uk-grid-match uk-grid-small uk-text-center"
          data-uk-grid
        >
          <div className="uk-width-1-1@m">
            <JVMThreadsTable threadsTable={threadsTable} />
          </div>
        </div>
      </div>
    );
  };
};

function mapStateToProps({ metrics: { threadsTable } }) {
  return { threadsTable };
};

export default connect(mapStateToProps)(SummaryGrid);
