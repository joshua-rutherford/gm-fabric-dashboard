import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import JVMHeapLineChart from './JVMHeapLineChart';
import JVMClassesAreaChart from './JVMClassesAreaChart';
import JVMFileDescriptorAreaChart from './JVMFileDescriptorAreaChart';
import { getLatestAttribute, getAttributeOverTime, mergeResults } from '../utils';

class JVMGrid extends Component {
  static propTypes = {
    jvm: PropTypes.object
  };

  render() {
    const { jvm } = this.props;
    return (
      <div>
        <div
          className="uk-grid-match uk-grid-small uk-text-center"
          data-uk-grid
        >
          <div className="uk-width-1-2@l">
            <JVMHeapLineChart
              maxHeap={getLatestAttribute(jvm, 'heap.max')}
              usedAndCommittedHeapArr={mergeResults(getAttributeOverTime(jvm, 'heap.committed'), getAttributeOverTime(jvm, 'heap.used'))}
            />
          </div>
          <div className="uk-width-1-2@l">
            <JVMClassesAreaChart
              currentLoadedArr={getAttributeOverTime(jvm, 'classes.currentLoaded')}
              totalLoaded={getLatestAttribute(jvm, 'classes.totalLoaded')}
              totalUnloaded={getLatestAttribute(jvm, 'classes.totalUnloaded')}
            />
          </div>
          <div className="uk-width-1-2@l">
            <JVMFileDescriptorAreaChart
              fdCountArr={getAttributeOverTime(jvm, 'fdCount')}
              fdLimit={getLatestAttribute(jvm, 'fdLimit')}
            />
          </div>
        </div>
      </div>
    );
  };
};

function mapStateToProps({ metrics: { jvm } }) {
  return { jvm };
};

export default connect(mapStateToProps)(JVMGrid);
