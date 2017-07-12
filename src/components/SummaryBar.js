import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import ms from 'ms';
import _ from 'lodash';
import { getLatestAttribute, getSparkLineOfValue, getSparkLineOfNetChange, parseJSONString } from '../utils';
import SummaryBarCard from './SummaryBarCard';

SummaryBar.propTypes = {
  dashboards: PropTypes.object,
  interval: PropTypes.number,
  metrics: PropTypes.object
};

function SummaryBar({ dashboards, metrics, interval }) {
  return (
    <div className="summary-bar-container">
      <div
        className="uk-grid-collapse uk-grid-match uk-flex-center uk-child-width-small"
        data-uk-grid
        id="summary-bar"
      >
        <SummaryBarCard
          href="/summary"
          lineOne={`${ms(getLatestAttribute(metrics, 'jvm/uptime'))} UPTIME`}
          tabIndex={1}
          title="Summary"
        />
        <SummaryBarCard
          href="/route"
          tabIndex={3}
          title="Routes"
        />
        {/*<SummaryBarCard
          chartData={getSparkLineOfValue(metrics, 'jvm/thread/count')}
          href="/threads"
          lineOne={getLatestAttribute(metrics, 'jvm/thread/count')}
          tabIndex={4}
          title="Threads"
        />
        */}  
        {_.toPairs(dashboards).map(pair => {
          const hasValidChart = _.has(pair[1], 'summaryCard.chart.type'); // && _.has(dashboard, 'summaryCard.chart.dataAttribute')
          const lineOne = parseJSONString(pair[1].summaryCard.lineOne, metrics);
          const lineTwo = parseJSONString(pair[1].summaryCard.lineTwo, metrics);
          let chartData;
          if (hasValidChart && pair[1].summaryCard.chart.type === 'value') {
            console.log("VALUE");
            chartData = getSparkLineOfValue(metrics, pair[1].summaryCard.chart.dataAttribute);
          } else if (hasValidChart &&  pair[1].summaryCard.chart.type === 'netChange') {
            chartData = getSparkLineOfNetChange(metrics, pair[1].summaryCard.chart.dataAttribute);
          } else {
            chartData = undefined;
          }
          return (
            <SummaryBarCard
              chartData={chartData}
              href={`/dashboard/${pair[0]}`}
              lineOne={lineOne}
              lineTwo={lineTwo}
              tabIndex={9}
              title={pair[1].name}
            />
          );
        })}
        <SummaryBarCard
          href={`/json`}
          lineOne={`{ ... }`}
          tabIndex={8}
          title="JSON"
        />
        <SummaryBarCard
          href={`/settings`}
          lineOne={<span data-uk-icon="icon: cog; ratio: 1.5"></span>}
          tabIndex={9}
          title="Settings"
        />
      </div >
    </div >
  );
}

function mapStateToProps({ dashboards, metrics, settings: { interval } }) {
  return { dashboards, metrics, interval };
};

export default connect(mapStateToProps)(SummaryBar);
