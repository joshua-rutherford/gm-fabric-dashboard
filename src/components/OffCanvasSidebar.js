import React from 'react';
import { Link, IndexLink } from 'react-router';

const Sidebar = () => {
  return (
    <div
      data-uk-offcanvas="mode: push; overlay: true"
      id="sidebar"
    >
      <div className="uk-offcanvas-bar">
        <ul
          className="uk-nav-parent-icon uk-nav-default"
          data-uk-nav="multiple: true"
        >
          <li><IndexLink to="/">Summary</IndexLink></li>
          <li><Link to="/http">HTTP</Link></li>
          <li><Link to="/jvm">JVM</Link></li>
          <li><Link to="/finagle">Finagle</Link></li>
          <li><Link to="/admin">Admin</Link></li>
          <li>
            <a
              href="https://github.com/DecipherNow/gm-fabric-dashboard"
              target="_blank"
            >
              <span
                className="uk-margin-small-right"
                data-uk-icon="icon: github"
              />
              View on GitHub
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
