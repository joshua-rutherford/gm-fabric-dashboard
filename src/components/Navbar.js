import React from "react";
import decipherLogo from "../images/decipherLogo.svg";
import gmLogo from "../images/gmFabricLogo.svg";

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
          <img
            alt="Gray Matter Logo"
            className="logo"
            id="product-logo"
            src={gmLogo}
            style={{ width: "20px" }}
          />
          <span className="logo" id="logo-text">
            Fabric
          </span>
        </div>
      </div>
      <div className="uk-navbar-right">
        <div className="uk-navbar-item">
          <a
            className="uk-link-muted"
            href="https://github.com/DecipherNow/gm-fabric-dashboard/blob/master/CHANGELOG.md"
          >
            v0.1.1
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
