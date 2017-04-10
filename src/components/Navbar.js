import React from 'react';
import decipherLogo from '../images/decipherLogo.svg';
import gmLogo from '../images/gmFabricLogo.svg';

const Navbar = () => {
  return (
    <nav className="uk-navbar">
      <div className="uk-navbar-left">
        <a
          className="uk-navbar-item uk-logo"
          href="#"
          role="button"
        >
          <img
            alt='Decipher Logo'
            className="logo"
            src={decipherLogo}
            style={{ width: '30px' }}
          />
          <img
            alt='Gray Matter Logo'
            className="logo"
            id="product-logo"
            src={gmLogo}
            style={{ width: '40px' }}
          />
          <span
            className="logo"
            id="logo-text"
          >
            Fabric
          </span>
        </a>
      </div>
      <div className="uk-navbar-right uk-hidden@m">
        <a
          aria-label="Open Menu"
          className="uk-navbar-item hamburger"
          data-uk-icon="icon: table; ratio: 2"
          data-uk-toggle="target: #sidebar"
        />
      </div>
    </nav>
  );
};

export default Navbar;
