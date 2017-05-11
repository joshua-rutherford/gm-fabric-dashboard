import React from 'react';
import decipherLogo from '../images/decipherLogo.svg';
import gmLogo from '../images/gmFabricLogo.svg';

const Navbar = () => {
  return (
    <nav
      className="uk-navbar"
    >
      <div className="uk-navbar-left">
        <div
          className="uk-navbar-item uk-logo"
        >
          <img
            alt='Decipher Logo'
            className="logo"
            src={decipherLogo}
          />
          <img
            alt='Gray Matter Fabric'
            className="logo"
            id="product-logo"
            src={gmLogo}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
