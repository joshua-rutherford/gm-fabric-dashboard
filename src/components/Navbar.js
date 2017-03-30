import React from 'react';
import logo from '../images/gmFabricLogo.svg';

const Navbar = () => {
  return (
    <div className="uk-background-primary">
      <nav className="uk-navbar">
        <div className="uk-navbar-left">
          <a
            className="uk-navbar-item uk-logo"
            href="#"
          >
            <img
              alt='Graymatter Logo'
              className="logo"
              src={logo}
              style={{ width: '200px' }}
            />
          </a>
        </div>
        <div className="uk-navbar-right uk-hidden@m">
          <a
            className="uk-navbar-item hamburger"
            data-uk-icon="icon: table; ratio: 2"
            data-uk-toggle="target: #sidebar"
          />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
