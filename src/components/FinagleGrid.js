import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { getLatestAttribute } from '../utils';
import GMBasicMetrics from './GMBasicMetrics';
import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class FinagleGrid extends Component {
  static propTypes = {
    finagle: PropTypes.object
  };

  render() {
    const { finagle } = this.props;
    return (
      <div>
        <ResponsiveReactGridLayout
          breakpoints={{lg: 1200, md: 996, sm: 768}}  
          cols={{lg: 12, md: 8, sm: 4}}
          rowHeight={60}
        >
          <div
            data-grid={{ x: 0, y: 0, w: 4, h: 5, minW: 3, minH: 5 }}
            key='a'
            style={{
              border: 'solid',
              overflow: 'hidden'
            }}  
          >
            <GMBasicMetrics
              detailLines={{
                "Count": getLatestAttribute(finagle, 'timer.deviationMs.count'),
                "Average": Math.round(getLatestAttribute(finagle, 'timer.deviationMs.avg')),
                "Max": getLatestAttribute(finagle, 'timer.deviationMs.max'),
                "Min": getLatestAttribute(finagle, 'timer.deviationMs.min'),
                "Sum": getLatestAttribute(finagle, 'timer.deviationMs.sum')
              }}
              title="Timer Deviation"
            />
          </div> 
          <div
            data-grid={{ x: 4, y: 0, w: 4, h: 5, minW: 3, minH: 5 }}
            key='b'
            style={{
              border: 'solid',
              overflow: 'hidden'
            }}  
          >
            <GMBasicMetrics
              detailLines={{
                "Count": getLatestAttribute(finagle, 'timer.pendingTasks.count'),
                "Average": Math.round(getLatestAttribute(finagle, 'timer.pendingTasks.avg')),
                "Max": getLatestAttribute(finagle, 'timer.pendingTasks.max'),
                "Min": getLatestAttribute(finagle, 'timer.pendingTasks.min'),
                "Sum": getLatestAttribute(finagle, 'timer.pendingTasks.sum')
              }}
              title="Pending Timer Tasks"
            />
          </div>
          <div
            data-grid={{ x: 8, y: 0, w: 4, h: 5, minW: 3, minH: 4 }}
            key='c'
            style={{
              border: 'solid',
              overflow: 'hidden'
            }}  
          >  
            <GMBasicMetrics
              detailLines={{
                "Active Tasks": getLatestAttribute(finagle, 'futurePool.activeTasks'),
                "Completed Tasks": getLatestAttribute(finagle, 'futurePool.completedTasks'),
                "Pool Size": getLatestAttribute(finagle, 'timer.poolSize')
              }}
              title="Future Pool"
            />
          </div> 
          <div
            data-grid={{ x: 0, y: 0, w: 4, h: 5, minW: 3, minH: 3 }}
            key='d'
            style={{
              border: 'solid',
              overflow: 'hidden'
            }}  
          >  
            <GMBasicMetrics
              detailLines={{
                "Initial Resolution": getLatestAttribute(finagle, 'clientregistry.initialresolutionMs'),
                "Size": getLatestAttribute(finagle, 'futurePool.completedTasks'),
                "Pool Size": getLatestAttribute(finagle, 'clientregistry.size')
              }}
              title="Future Pool"
            />
          </div>  
        </ResponsiveReactGridLayout>
      </div>
    );
  };
};

function mapStateToProps({ metrics: { finagle } }) {
  return { finagle };
};

export default connect(mapStateToProps)(FinagleGrid);
