import React from 'react';

const Sidebar = () => {
  return (
    <div
      data-uk-offcanvas="overlay: true"
      id="sidebar"
    >
      <div className="uk-offcanvas-bar">
        <ul
          className="uk-nav-parent-icon uk-nav-default"
          data-uk-nav="multiple: true"
        >
          <li><a href="#">Summary</a></li>
          <li className="uk-parent">
            <a href="#">Listening Servers</a>
            <ul className="uk-nav-sub">
              <li><a href="#">adminhttp</a></li>
              <li><a href="#">http</a></li>
              <li><a href="#">thrift</a></li>
            </ul>
          </li>
          <li className="uk-parent">
            <a href="#">Metrics</a>
            <ul className="uk-nav-sub">
              <li><a href="#">Watch</a></li>
              <li><a href="#">Histograms</a></li>
              <li><a href="#">Metrics</a></li>
              <li><a href="#">Per-Host Metrics</a></li>
            </ul>
          </li>
          <li className="uk-parent">
            <a href="#">Misc</a>
            <ul className="uk-nav-sub">
              <li><a href="#">Abort Server</a></li>
              <li><a href="#">Quit Server</a></li>
            </ul>
          </li>
          <li className="uk-parent">
            <a href="#">Performance Profile</a>
            <ul className="uk-nav-sub">
              <li><a href="#">Contention</a></li>
              <li><a href="#">Heap</a></li>
              <li><a href="#">Profile</a></li>
              <li><a href="#">Blocked Profile</a></li>
            </ul>
          </li>
          <li className="uk-parent">
            <a href="#">Process Info</a>
            <ul className="uk-nav-sub">
              <li><a href="#">Build Properties</a></li>
              <li><a href="#">Lint</a></li>
              <li><a href="#">Threads</a></li>
              <li><a href="#">Announcer</a></li>
              <li><a href="#">Dtab</a></li>
              <li><a href="#">Registry</a></li>
              <li><a href="#">Toggles</a></li>
            </ul>
          </li>
          <li className="uk-parent">
            <a href="#">Utilities</a>
            <ul className="uk-nav-sub">
              <li><a href="#">Ping</a></li>
              <li><a href="#">Shutdown</a></li>
              <li><a href="#">Tracing</a></li>
              <li><a href="#">Events</a></li>
              <li><a href="#">Logging</a></li>
            </ul>
          </li>
          <li className="uk-nav-divider" />
          <li>
            <a href="https://github.com/DecipherNow/gm-fabric-dashboard">
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
