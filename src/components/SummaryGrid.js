import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getLatestAttribute, getAttributeForSparkline, getAttributeChangesForSparkline } from '../utils';
import ms from 'ms';
import filesize from 'filesize';
import { Sparklines, SparklinesLine } from 'react-sparklines';

class SummaryGrid extends Component {
  static propTypes = {
    jvm: PropTypes.object
  };
  render() {
    const { jvm } = this.props;
    return (
      <div>
        <div
          className="uk-section uk-section-muted"
          id="summary-grid-header-section"
        >
          <div className="uk-container">
            <h2>Summary</h2>
            <div
              className="uk-grid-collapse uk-child-width-expand@s"
              data-uk-grid
              id="summary-header-grid"
            >
              <div className="summary-header-grid-item">
                <h3 className="uk-text-small uk-text-muted uk-text-uppercase">Uptime</h3>
                <p>{ms(getLatestAttribute(jvm, 'uptime'))}</p>
              </div>
              <div>
                <h3 className="uk-text-small uk-text-muted uk-text-uppercase">Threads</h3>
                <p>{getLatestAttribute(jvm, 'thread.count')}</p>
                <Sparklines
                  data={getAttributeForSparkline(jvm, 'thread.count')}
                  margin={5}
                >
                  <SparklinesLine color="green" />
                </Sparklines>
              </div>
              <div>
                <h3 className="uk-text-small uk-text-muted uk-text-uppercase">Memory Used</h3>
                <p>{filesize(getLatestAttribute(jvm, 'mem.current.used'))}</p>
                <Sparklines
                  data={getAttributeForSparkline(jvm, 'mem.current.used')}
                  margin={5}
                >
                  <SparklinesLine color="red" />
                </Sparklines>
              </div>
              <div>
                <h3 className="uk-text-small uk-text-muted uk-text-uppercase">Garbage Collection</h3>
                <p>{ms(getLatestAttribute(jvm, 'gc.msec'))}</p>
                <Sparklines
                  data={getAttributeChangesForSparkline(jvm, 'gc.msec')}
                  margin={5}
                >
                  <SparklinesLine color="black" />
                </Sparklines>
              </div>
            </div>
          </div>
        </div>
        <div className="uk-section uk-section-default">
          <div
            className="uk-grid-small uk-child-width-1-2@s"
            data-uk-grid
            id="summary-grid-body-section"
          >
            <div className="uk-panel">
              <h3>Essentials</h3>
              <hr />
              <div className="uk-text-small uk-text-muted uk-text-uppercase">Name</div>
              0000000001
              <div className="uk-text-small uk-text-muted uk-text-uppercase">Health State</div>
              Healthy
              <div className="uk-text-small uk-text-muted uk-text-uppercase">Status</div>
              Up
              <div className="uk-text-small uk-text-muted uk-text-uppercase">Type</div>
              Instance
              <div className="uk-text-small uk-text-muted uk-text-uppercase">Upgrade Domain</div>
              0
              <div className="uk-text-small uk-text-muted uk-text-uppercase">Fault Domain</div>
              fd:/0
              <div className="uk-text-small uk-text-muted uk-text-uppercase">IP Address or Domain Name</div>
              {`${window.location.hostname}:${window.location.port}`}
              <div className="uk-text-small uk-text-muted uk-text-uppercase">IS Seed Instance</div>
              True
            </div>
            <div className="uk-panel">
              <h3>Details</h3>
              <hr />
              <div className="uk-text-small uk-text-muted uk-text-uppercase">ID</div>
              System/ActivityStreamService
              <div className="uk-text-small uk-text-muted uk-text-uppercase">Service Kind</div>
              Stateful
              <div className="uk-text-small uk-text-muted uk-text-uppercase">Name</div>
              fabric:/System/ActivityStreamService
              <div className="uk-text-small uk-text-muted uk-text-uppercase">Manifest Version</div>
              5.1.150.9590
              <div className="uk-text-small uk-text-muted uk-text-uppercase">Has Persisted State</div>
              True
              <div className="uk-text-small uk-text-muted uk-text-uppercase">Service Status</div>
              Active
              <div className="uk-text-small uk-text-muted uk-text-uppercase">IS Service Group</div>
              False
            </div>
          </div>
        </div>
      </div>
    );
  };
};

function mapStateToProps({ metrics: { jvm } }) {
  return { jvm };
};

export default connect(mapStateToProps)(SummaryGrid);
