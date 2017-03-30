import React from 'react';
import { Link, IndexLink } from 'react-router';

const OnCanvasSidebar = () => {
  return (
    <ul className="uk-nav">
      <li className="uk-active">
        <IndexLink
          className="uk-link-muted"
          to="/"
        >Summary
        </IndexLink>
      </li>
      <li>
        <Link
          className="uk-link-muted"
          to="http"
        >HTTP</Link>
      </li>
      <li>
        <Link
          className="uk-link-muted"
          to="jvm"
        >JVM</Link>
      </li>
      <li>
        <Link
          className="uk-link-muted"
          to="finagle"
        >Finagle</Link>
      </li>
      <li>
        <Link
          className="uk-link-muted"
          to="admin"
        >Admin</Link>
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

export default OnCanvasSidebar;
