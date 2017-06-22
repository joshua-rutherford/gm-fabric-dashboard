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
  https: PropTypes.object,
  interval: PropTypes.number,
  jvm: PropTypes.object,
  route: PropTypes.object,
  threads: PropTypes.object
};

function SummaryBar({ finagle, https, http, interval, jvm, route, threads }) {
  const httpRequests = Number(getLatestAttribute(http, 'requests')) + Number(getLatestAttribute(https, 'requests'));
  const successResponses = Number(getLatestAttribute(http, 'success')) + Number(getLatestAttribute(https, 'success'));
  const successRate = successResponses ? Math.round(successResponses / httpRequests * 100) : 100;

  return (
    <div className="summary-bar-container">
      <div
        className="uk-grid-collapse uk-grid-match uk-flex-center uk-child-width-small"
        data-uk-grid
        id="summary-bar"
      >
        <SummaryBarCard
          href="/summary"
          lineOne={`${ms(getLatestAttribute(jvm, 'uptime'))} UPTIME`}
          tabIndex={1}
          title="Summary"
        />
        {(https || http) &&
          // The HTTP card displays if the HTTP object exists in Redux
          <SummaryBarCard
            href="/http"
            lineOne={`${String(httpRequests).replace(/(.)(?=(\d{3})+$)/g, '$1,')} - ${successRate}%`}
            tabIndex={2}
            title="HTTPS"
          />
        }
        {route &&
          // The Route card displays if the route object exists in Redux
          <SummaryBarCard
            href="/route"
            lineOne={route ? Object.keys(route).length : 0}
            tabIndex={3}
            title="Routes"
          />
        }
        {(jvm || threads) &&
          // The Thread card displays if the metrics store has the thread.count from the jvm or the threads object
          // If it has the thread count, but not the detailed threads object, it is treated as part of /jvm
          <SummaryBarCard
            chartData={getAttributeForSparkline(jvm, 'thread.count')}
            href={threads ? `/threads` : `/jvm`}
            lineOne={getLatestAttribute(jvm, 'thread.count')}
            tabIndex={4}
            title="Threads"
          />
        }
        {jvm &&
          <SummaryBarCard
            chartData={getAttributeForSparkline(jvm, 'mem.current.used')}
            href={`/jvm`}
            lineOne={filesize(getLatestAttribute(jvm, 'mem.current.used'))}
            tabIndex={5}
            title="Memory Used"
          />
        }
        {jvm &&
          <SummaryBarCard
            chartData={getAttributeChangesForSparkline(jvm, 'gc.msec')}
            href="/jvm"
            lineOne={ms(getLatestAttribute(jvm, 'gc.msec'))}
            tabIndex={6}
            title="Garbage Col."
          />
        }
        {finagle &&
          <SummaryBarCard
            href="/finagle"
            lineOne={`${getLatestAttribute(finagle, 'futurePool.activeTasks')} Active`}
            lineTwo={`${getLatestAttribute(finagle, 'timer.pendingTasks.count')} Pending`}
            tabIndex={7}
            title="Finagle"
          />
        }
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

function mapStateToProps({ metrics: { finagle, https, http, jvm, route, threads }, settings: { interval } }) {
  return { finagle, https, http, interval, jvm, route, threads };
};

export default connect(mapStateToProps)(SummaryBar);
