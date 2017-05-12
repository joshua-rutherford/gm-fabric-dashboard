import React, { Component } from 'react';
import { Link } from 'react-router';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

class RouteBar extends Component {
  static propTypes = {
    route: PropTypes.object
  };

  render() {
    const { route } = this.props;
    return (
      <div>
        <div className="route-bar-container">
          <div
            className="uk-grid-collapse uk-flex-center"
            data-uk-grid
            id="summary-bar"
          >
            {route && Object.keys(route).sort().map(route => {
              // Escape the component name because they are automatically generated from paths
              const escapedRoute = route.replace(/\//g, '%2F');
              return (
                <Link
                  activeClassName="route-bar-card-active"
                  className="uk-card uk-card-small route-bar-card"
                  key={route}
                  to={`/route/${escapedRoute}`}
                >
                  <div className="route-bar-card-body">
                    {`${route}`}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <hr className="route-bar-hr" />
        {this.props.children}
      </div>
    );
  };
};

function mapStateToProps({ metrics: { route } }) {
  return { route };
};

export default connect(mapStateToProps)(RouteBar);
