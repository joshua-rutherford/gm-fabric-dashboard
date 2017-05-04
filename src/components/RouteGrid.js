import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { getLatestAttribute, getAttributeChangesOverTime } from '../utils';
import RouteRequestAreaChart from './RouteRequestAreaChart';

class SummaryGrid extends Component {
  static propTypes = {
    params: PropTypes.object,
    route: PropTypes.object
  };

  render() {
    const { params, route } = this.props;
    const routeVerbs = (route && Object.keys(route[params.routeName])) || [];
    return (
      <div>
        <div
          className="uk-grid-match uk-grid-collapse uk-text-center"
          data-uk-grid
        >
          {routeVerbs.map(verbName => (
            <div
              className="uk-width-1-2@m"
              key={verbName}
            >
              <div className="uk-card uk-card-small uk-card-body">
                <h3 className="uk-card-title">{`${verbName} /${params.routeName}`}</h3>
                <p>Requests: {getLatestAttribute(route, `${params.routeName}.${verbName}.requests`)}</p>
                <p>Status Code 2XX : {getLatestAttribute(route, `${params.routeName}.${verbName}.status.2XX`)}</p>
                <p>Status Code 200 : {getLatestAttribute(route, `${params.routeName}.${verbName}.status.200`)}</p>
              </div>
            </div>
          ))}
          {routeVerbs.map(verbName => (
            <div
              className="uk-width-1-2@m"
              key={verbName}
            >
              <RouteRequestAreaChart
                requestsPerSecondArr={getAttributeChangesOverTime(route, `${params.routeName}.${verbName}.requests`)}
                routeName={params.routeName}
                verbName={verbName}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };
};

function mapStateToProps({ metrics: { route } }) {
  return { route };
};

export default connect(mapStateToProps)(SummaryGrid);
