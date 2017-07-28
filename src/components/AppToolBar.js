import React from "react";
import { PropTypes } from "prop-types";
import { NavLink, Link } from "react-router-dom";

AppToolBar.propTypes = {
  pathname: PropTypes.string.isRequired
};

function AppToolBar({ pathname }) {
  return (
    <nav className="app-header app-toolbar">
      <ol className="app-breadcrumbs">
        <li className="app-breadcrumb">
          <Link to="/">root</Link>
        </li>
        {//strip out leading slashes to get route as array
        pathname.replace(/^\/|\/$/g, "").split("/").map((val, idx) =>
          <li className="app-breadcrumb">
            <Link to={`${pathname.substr(0, pathname.indexOf(val))}${val}`}>
              {val}
            </Link>
          </li>
        )}
      </ol>

      <NavLink className="uk-button settings-button" to="/settings">
        <span
          className="settings-cog icon"
          data-uk-icon="icon: cog; ratio: .84"
        />
      </NavLink>
    </nav>
  );
}

export default AppToolBar;
