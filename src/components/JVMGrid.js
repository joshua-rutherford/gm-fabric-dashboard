import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import GMLineChart from './GMLineChart';
import { getLatestAttribute, getTimeSeriesOfValue, mergeTimeSeries, mapOverTimeSeries } from '../utils';
import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const BYTES_TO_MB = 1048576;

class JVMGrid extends Component {
  static propTypes = {
    jvm: PropTypes.object
  };

  render() {
    const { jvm } = this.props;
    return (
      <div>
        <ResponsiveReactGridLayout
          breakpoints={{ lg: 1200, md: 996, sm: 768 }}  
          cols={{ lg: 12, md: 8, sm: 4 }}
          onLayoutChange={(layout, allLayouts) => console.log('layout: ', layout, allLayouts)}
          layouts={{
            lg: [
              {
                i: 'jvmHeapChart',
                x: 0,
                y: 0,
                w: 6,
                h: 9,
                minW: 4,
                minH: 5
              },
              {
                i: 'jvmClassesChart',
                x: 6,
                y: 0,
                w: 6,
                h: 9,
                minW: 4,
                minH: 5
              },
            ]
          }}
          rowHeight={60}
        >
          <div
            key='jvmHeapChart'
            style={{
              border: 'solid',
              overflow: 'hidden'
            }}  
          >
            <GMLineChart
              detailLines={[
                `Max Heap: ${Math.round(getLatestAttribute(jvm, 'heap.max')  / BYTES_TO_MB)} MB`,
              ]}
              timeSeries={mapOverTimeSeries(
                mergeTimeSeries(
                  getTimeSeriesOfValue(jvm, 'heap.committed'),
                  getTimeSeriesOfValue(jvm, 'heap.used')
                ),
                ['committed', 'used'],
                (currentVal) => Math.round(currentVal / BYTES_TO_MB)

              )}
              title="Heap"
            />  
          </div>
          <div
            key='jvmClassesChart'
            style={{
              border: 'solid',
              overflow: 'hidden'
            }}  
          >
            <GMLineChart
              detailLines={[
                `Total Loaded: ${getLatestAttribute(jvm, 'classes.totalLoaded')}`,
                `Total Unloaded: ${getLatestAttribute(jvm, 'classes.totalUnloaded')}`
              ]}
              timeSeries={getTimeSeriesOfValue(jvm, 'classes.currentLoaded')}
              title="Classes"
            />
          </div>
        </ResponsiveReactGridLayout>
      </div>
    );
  };
};

function mapStateToProps({ metrics: { jvm } }) {
  return { jvm };
};

export default connect(mapStateToProps)(JVMGrid);
