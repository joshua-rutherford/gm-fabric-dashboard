import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import SummaryBarCard from './SummaryBarCard';
import { getBasename } from '../utils';

class RouteBar extends Component {
  static propTypes = {
    pathname: PropTypes.string,
    route: PropTypes.object
  };

  render() {
    const { pathname, route } = this.props;
    return (
      <div>
        <div className="summary-bar-container">
          <div
            className="uk-grid-collapse uk-flex-center"
            data-uk-grid
            id="summary-bar"
          >
            {route && Object.keys(route).map(route => {
              return (
                <SummaryBarCard
                  href={`${getBasename()}/route/${route}`}
                  isActive={pathname === `${getBasename()}/route/${route}`}
                  key={route}
                  title={`/${route}`}
                  width="uk-width-auto"
                />
              );
            })}
          </div>
        </div>
        {!route && (
          <div className="uk-width-1-1@m">
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title">No Routes Detected</h3>
            </div>
          </div>
        )}
        {this.props.children}
      </div>
    );
  };
};

function mapStateToProps({ metrics: { route }, routing: { locationBeforeTransitions: { pathname } } }) {
  return { pathname, route };
};

export default connect(mapStateToProps)(RouteBar);
