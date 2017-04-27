import filesize from 'filesize';
import ms from 'ms';
import { PropTypes } from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { getLatestAttribute, getAttributeForSparkline, getAttributeChangesForSparkline } from '../utils';
import SummaryBarCard from './SummaryBarCard';

SummaryBar.propTypes = {
  finagle: PropTypes.object,
  http: PropTypes.object,
  interval: PropTypes.number,
  jvm: PropTypes.object,
  pathname: PropTypes.string
};

function SummaryBar({ finagle, http, interval, jvm, pathname, route }) {
  const httpRequests = getLatestAttribute(http, 'requests');
  const successResponses = getLatestAttribute(http, 'success');
  const successRate = successResponses ? Math.round(successResponses / httpRequests * 100) : 100;
  return (
    <div className="summary-bar-container">
      <div
        className="uk-grid-collapse uk-grid-match uk-flex-center uk-child-width-small"
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
          href="/route"
          isActive={pathname.indexOf('/route',0) !== -1}
          lineOne={route? Object.keys(route).length : 0}
          tabIndex={3}
          title="Routes"
        />
        <SummaryBarCard
          chartData={getAttributeForSparkline(jvm, 'thread.count')}
          href="/threads"
          isActive={pathname === '/threads'}
          lineOne={getLatestAttribute(jvm, 'thread.count')}
          tabIndex={4}
          title="Threads"
        />
        <SummaryBarCard
          chartData={getAttributeForSparkline(jvm, 'mem.current.used')}
          href="/jvm"
          isActive={pathname === '/jvm'}
          lineOne={filesize(getLatestAttribute(jvm, 'mem.current.used'))}
          tabIndex={5}
          title="Memory Used"
        />
        <SummaryBarCard
          chartData={getAttributeChangesForSparkline(jvm, 'gc.msec')}
          href="/jvm"
          isActive={pathname === '/jvm'}
          lineOne={ms(getLatestAttribute(jvm, 'gc.msec'))}
          tabIndex={6}
          title="Garbage Col."
        />
        <SummaryBarCard
          href="/finagle"
          isActive={pathname === '/finagle'}
          lineOne={`${getLatestAttribute(finagle, 'futurePool.activeTasks')} Active`}
          lineTwo={`${getLatestAttribute(finagle, 'timer.pendingTasks.count')} Pending`}
          tabIndex={7}
          title="Finagle"
        />
        <SummaryBarCard
          href="/json"
          isActive={pathname === '/json'}
          lineOne={`{ ... }`}
          tabIndex={8}
          title="JSON"
        />
        <SummaryBarCard
          href="/settings"
          isActive={pathname === '/settings'}
          lineOne={ms(interval)}
          tabIndex={9}
          title="Settings"
        />
      </div >
    </div >
  );
}

function mapStateToProps({ metrics: { finagle, http, jvm, route}, routing: { locationBeforeTransitions: { pathname } }, settings: { interval } }) {
  return { finagle, http, interval, jvm, pathname, route };
};

export default connect(mapStateToProps)(SummaryBar);
