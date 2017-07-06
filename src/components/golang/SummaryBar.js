import filesize from 'filesize';
import { PropTypes } from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { getLatestAttribute, getSparkLineOfValue } from '../../utils';
import SummaryBarCard from '../SummaryBarCard';

SummaryBar.propTypes = {
  memory: PropTypes.object,
};

function SummaryBar({ memory }) {

  return (
    <div className="summary-bar-container">
      <div
        className="uk-grid-collapse uk-grid-match uk-flex-center uk-child-width-small"
        data-uk-grid
        id="summary-bar"
      >
        <SummaryBarCard
          href="/summary"
          lineOne={`??? UPTIME`}
          tabIndex={1}
          title="Summary"
        />
        <SummaryBarCard
          chartData={getSparkLineOfValue(memory, 'used')}
          href={`/summary`}
          lineOne={filesize(getLatestAttribute(memory, 'used'))}
          tabIndex={5}
          title="Memory Used"
        />
        <SummaryBarCard
          href={`/json`}
          lineOne={`{ ... }`}
          tabIndex={8}
          title="JSON"
        />
        <SummaryBarCard
          href={`/settings`}
          lineOne={<span data-uk-icon="icon: cog; ratio: 1.5"/>}
          tabIndex={9}
          title="Settings"
        />
      </div >
    </div >
  );
}

function mapStateToProps({ metrics: { memory } }) {
  return { memory };
};

export default connect(mapStateToProps)(SummaryBar);
