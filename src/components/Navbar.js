import React from "react";
import decipherLogo from "../images/decipherLogo.svg";
import gmLogo from "../images/gmFabricLogo.svg";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="uk-navbar">
      <div className="uk-navbar-left">
        <div className="uk-navbar-item uk-logo">
          <img
            alt="Decipher Logo"
            className="logo"
            src={decipherLogo}
            style={{ width: "20px" }}
          />
          <span className="logo" id="logo-text">
            Fabric
          </span>
          <a
            className="uk-link-muted version-link"
            href="https://github.com/DecipherNow/gm-fabric-dashboard/blob/master/CHANGELOG.md"
          >
            v0.1.1
          </a>
        </div>
        <div className="uk-navbar-item" />
      </div>
      <div className="uk-navbar-right">
        <NavLink
          className="uk-button uk-button-small settings-cog-button"
          to="/settings"
        >
          <span className="settings-cog" data-uk-icon="icon: cog; ratio: 1.5" />
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
