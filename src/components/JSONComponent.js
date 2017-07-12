import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Inspector from 'react-json-inspector';
import { connect } from 'react-redux';
import _ from 'lodash';
import {Responsive, WidthProvider} from 'react-grid-layout';
import GMLineChart from './GMLineChart';
import { getTimeSeriesOfValue } from '../utils';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class JSONComponent extends Component {
  static propTypes = {
    metrics: PropTypes.object
  };

  state = {
    selectedMetrics: "",
    headers: []
  };

  componentWillMount() {
    this.setState({ headers: Object.keys(this.props.metrics).sort() });
  }
  componentWillReceiveProps(nextProps) {
    if (_.isEqual(Object.keys(nextProps.metrics), Object.keys(this.props.metrics))) {
      this.setState({ headers: Object.keys(nextProps.metrics).sort() });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Update If the keys are different in metrics
    if (!_.isEqual(nextState.headers), this.state.headers) {
      return true;
    // Or if the selected object has changed / state of the selected object has changed
    } else if (!_.isEqual(this.props.metrics[this.state.selectedMetrics], this.props.metrics[this.state.selectedMetrics])) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { metrics } = this.props;
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
              data={this.state.headers}
              onClick={(clicked) => {
                this.setState({ selectedMetrics: clicked.value });
              }}
              tabIndex={20}
            />
          </div>
          <div
            data-grid={{ x: 4, y: 0, w: 8, h: 11, minW: 3, minH: 4  }}
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

// TODO: Only pass in the selected metrics objects, not the entire metrics stores
// This should reduce renders
function mapStateToProps({ metrics }) {
  return {
    metrics,
    keys: Object.keys(metrics)
  };
};

export default connect(mapStateToProps)(JSONComponent);
