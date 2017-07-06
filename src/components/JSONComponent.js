import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Inspector from 'react-json-inspector';
import { connect } from 'react-redux';
import { extractPaths } from '../utils';
import GMLineChart from './GMLineChart';
import { getTimeSeriesOfValue } from '../utils';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class JSONComponent extends Component {
  static propTypes = {
    metrics: PropTypes.object
  };

  state = { selectedMetrics: "" };

  render() {
    const { metrics } = this.props;
    const headers = extractPaths(metrics);
    return (
      <div>
        <ResponsiveReactGridLayout
          breakpoints={{lg: 1200, md: 996, sm: 768}}  
          cols={{lg: 12, md: 8, sm: 4}}
          rowHeight={60}
        >
          <div
            data-grid={{ x: 0, y: 0, w: 4, h: 11, minW: 3, minH: 4 }}
            key='tree'
            style={{
              border: 'solid',
              overflow: 'scroll',
            }}  
          >
            <Inspector
              data={headers}
              onClick={(clicked) => {
                if (Object.keys(clicked.value).length === 0) {
                  this.setState({ selectedMetrics: clicked.path });
                }
              }}
              tabIndex={20}
            />
          </div>
          <div
            data-grid={{ x: 4, y: 0, w: 4, h: 6, minW: 3, minH: 4  }}
            key='graph'
            style={{
              border: 'solid',
              overflow: 'hidden'
            }}  
          >
            {
              this.state.selectedMetrics !== "" ?
                <GMLineChart
                  timeSeries={getTimeSeriesOfValue(metrics, this.state.selectedMetrics)}
                  title={this.state.selectedMetrics}
                />
              :
                <h2>Select a metric</h2>  
            }  
          </div>
        </ResponsiveReactGridLayout>
      </div>
    );
  };
};

function mapStateToProps({ metrics }) {
  return { metrics };
};

export default connect(mapStateToProps)(JSONComponent);
