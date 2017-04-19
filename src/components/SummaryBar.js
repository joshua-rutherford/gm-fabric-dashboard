import filesize from 'filesize';
import ms from 'ms';
import { PropTypes } from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { getLatestAttribute, getAttributeForSparkline, getAttributeChangesForSparkline } from '../utils';
import IndicatorIcon from './IndicatorIcon';
import SummaryBarCard from './SummaryBarCard';

SummaryBar.propTypes = {
  http: PropTypes.object,
  interval: PropTypes.number,
  jvm: PropTypes.object,
  pathname: PropTypes.string
};

function SummaryBar({ http, interval, jvm, pathname }) {
  const httpRequests = getLatestAttribute(http, 'requests');
  const successResponses = getLatestAttribute(http, 'success');
  const successRate = successResponses ? Math.round(successResponses / httpRequests * 100) : 100;
  return (
    <div className="summary-bar-container">
      <div className="service-bar-title">
        <IndicatorIcon
          alt={'Healthy'}
          color={'green'}
          diameter={14}
        />
        <span className="uk-margin-left uk-text-large">{`Super Awesome Service`}</span>
      </div>
      <div
        className="uk-grid-collapse uk-child-width-small"
        data-uk-grid
        id="summary-bar"
      >
        <SummaryBarCard
          href="/"
          isActive={pathname === '/'}
          lineOne={ms(getLatestAttribute(jvm, 'uptime'))}
          tabIndex={1}
          title="Uptime"

        />
        <SummaryBarCard
          href="/http"
          isActive={pathname === '/http'}
          lineOne={`${String(httpRequests).replace(/(.)(?=(\d{3})+$)/g, '$1,')} - ${successRate}%`}
          tabIndex={2}
          title="HTTP"
        />
        <SummaryBarCard
          chartData={getAttributeForSparkline(jvm, 'thread.count')}
          href="/threads"
          isActive={pathname === '/threads'}
          lineOne={getLatestAttribute(jvm, 'thread.count')}
          tabIndex={3}
          title="Threads"
        />
        <SummaryBarCard
          chartData={getAttributeForSparkline(jvm, 'mem.current.used')}
          href="/jvm"
          isActive={pathname === '/jvm'}
          lineOne={filesize(getLatestAttribute(jvm, 'mem.current.used'))}
          tabIndex={4}
          title="Memory Used"
        />
        <SummaryBarCard
          chartData={getAttributeChangesForSparkline(jvm, 'gc.msec')}
          href="/jvm"
          isActive={pathname === '/jvm'}
          lineOne={ms(getLatestAttribute(jvm, 'gc.msec'))}
          tabIndex={5}
          title="Garbage Col."
        />
        <SummaryBarCard
          href="/finagle"
          isActive={pathname === '/finagle'}
          lineOne="0 Active"
          lineTwo="0 Pending"
          tabIndex={6}
          title="Finagle"
        />
        <SummaryBarCard
          href="/json"
          isActive={pathname === '/json'}
          lineOne={`{ ... }`}
          tabIndex={7}
          title="JSON"
        />
        <SummaryBarCard
          href="/settings"
          isActive={pathname === '/settings'}
          lineOne={ms(interval)}
          tabIndex={8}
          title="Settings"
        />
      </div >
    </div >
  );
}

function mapStateToProps({ metrics: { http, jvm }, routing: { locationBeforeTransitions: { pathname } }, settings: { interval } }) {
  return { http, jvm, pathname, interval };
};

export default connect(mapStateToProps)(SummaryBar);
