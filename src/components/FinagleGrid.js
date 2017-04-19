import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { getLatestAttribute } from '../utils';
import FinagleTimerStats from './FinagleTimerStats';
import FinaglePendingTasksStats from './FinaglePendingTasksStats';
import FinagleFuturePoolStats from './FinagleFuturePoolStats';
import FinagleClientRegistryStats from './FinagleClientRegistryStats';

class FinagleGrid extends Component {
  static propTypes = {
    finagle: PropTypes.object
  };

  render() {
    const { finagle } = this.props;
    return (
      <div>
        <div
          className="uk-grid-match uk-grid-small uk-text-center"
          data-uk-grid
        >
          <div className="uk-width-1-2@l">
            <FinagleTimerStats
              timerDeviationAverage={getLatestAttribute(finagle, 'timer.deviationMs.avg')}
              timerDeviationCount={getLatestAttribute(finagle, 'timer.deviationMs.count')}
              timerDeviationMax={getLatestAttribute(finagle, 'timer.deviationMs.max')}
              timerDeviationMin={getLatestAttribute(finagle, 'timer.deviationMs.min')}
              timerDeviationSum={getLatestAttribute(finagle, 'timer.deviationMs.sum')}
            />
          </div>
          <div className="uk-width-1-2@l">
            <FinaglePendingTasksStats
              pendingTasksAverage={getLatestAttribute(finagle, 'timer.pendingTasks.avg')}
              pendingTasksCount={getLatestAttribute(finagle, 'timer.pendingTasks.count')}
              pendingTasksMax={getLatestAttribute(finagle, 'timer.pendingTasks.max')}
              pendingTasksMin={getLatestAttribute(finagle, 'timer.pendingTasks.min')}
              pendingTasksSum={getLatestAttribute(finagle, 'timer.pendingTasks.sum')}
            />
          </div>
          <div className="uk-width-1-2@l">
            <FinagleFuturePoolStats
              activeTasks={getLatestAttribute(finagle, 'futurePool.activeTasks')}
              completedTasks={getLatestAttribute(finagle, 'futurePool.completedTasks')}
              poolSize={getLatestAttribute(finagle, 'timer.poolSize')}
            />
          </div>
          <div className="uk-width-1-2@l">
            <FinagleClientRegistryStats
              initialResolution={getLatestAttribute(finagle, 'clientregistry.initialresolutionMs')}
              size={getLatestAttribute(finagle, 'clientregistry.size')}
            />
          </div>
        </div>
      </div>
    );
  };
};

function mapStateToProps({ metrics: { finagle } }) {
  return { finagle };
};

export default connect(mapStateToProps)(FinagleGrid);
