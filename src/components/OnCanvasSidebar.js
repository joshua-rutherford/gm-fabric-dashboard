import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';

OnCanvasSidebar.propTypes = {
  pathname: PropTypes.string,
  route: PropTypes.object
};

function OnCanvasSidebar({ pathname, route }) {
  return (
    <ul
      className="uk-nav uk-nav-default"
      data-uk-nav
    >
      <li className={pathname === '/' ? 'uk-active' : ''}>
        <IndexLink
          className={'uk-link-muted'}
          to="/"
        >Summary
        </IndexLink>
      </li>
      <li className={pathname === '/http' ? 'uk-active' : ''}>
        <Link
          className="uk-link-muted"
          to="/http"
        >HTTP</Link>
        {route && Object.keys(route).length &&
          <ul className="uk-nav-sub">
            {Object.keys(route).map(route => {
              const pathName = `/route/${route}`;
              return (
                <li
                  className={pathname === { pathName } ? 'uk-active' : ''}
                  key={route}
                >
                  <Link
                    className="uk-link-muted"
                    to={`/route/${route}`}
                  >/{route}</Link>
                </li>
              );
            })}
          </ul>
        }
      </li>
      <li className={pathname === '/jvm' ? 'uk-active' : ''}>
        <Link
          className="uk-link-muted"
          to="/jvm"
        >JVM</Link>
      </li>
      <li className={pathname === '/finagle' ? 'uk-active' : ''}>
        <Link
          className="uk-link-muted"
          to="/finagle"
        >Finagle</Link>
      </li>
      <li className={pathname === '/json' ? 'uk-active' : ''}>
        <Link
          className="uk-link-muted"
          to="/json"
        >JSON</Link>
      </li>
      <li className={pathname === '/settings' ? 'uk-active' : ''}>
        <Link
          className="uk-link-muted"
          to="/settings"
        >Settings</Link>
      </li>
      <li className="uk-nav-divider on-canvas-sidebar-divider" />
      <li>
        <a
          className="uk-link-muted"
          href="https://github.com/DecipherNow/gm-fabric-dashboard"
          target="_blank"
        >
          <span
            className="uk-margin-small-right"
            data-uk-icon="icon: github"
          />
          <span>GitHub</span>
        </a>
      </li>
    </ul>
  );
};

function mapStateToProps({ metrics: { route }, routing: { locationBeforeTransitions: { pathname } } }) {
  return { route, pathname };
};

export default connect(mapStateToProps)(OnCanvasSidebar);
