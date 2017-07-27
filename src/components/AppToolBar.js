import React from "react";
import { NavLink, Link } from "react-router-dom";

const AppToolBar = () => {
  return (
    <nav className="app-header app-toolbar">
      <ol className="app-breadcrumbs">
        <li className="app-breadcrumb">
          <Link to="">Breadcrumb 1</Link>
        </li>
        <li className="app-breadcrumb">
          <Link to="">Breadcrumb 2</Link>
        </li>
        <li className="app-breadcrumb">
          <Link to="">Breadcrumb 3</Link>
        </li>
      </ol>

      <NavLink
        className="uk-button settings-button"
        to="/settings"
      >
        <span className="settings-cog icon" data-uk-icon="icon: cog; ratio: .84" />
      </NavLink>

    </nav>
  );
};

export default AppToolBar;
