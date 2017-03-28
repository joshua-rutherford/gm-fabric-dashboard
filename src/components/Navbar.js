import React from 'react';
import logo from '../images/gmFabricLogo.svg';

const Navbar = () => {
  return (
    <nav className="uk-navbar-container uk-navbar uk-background-primary">
      <div className="uk-navbar-left">
        <a
          className="uk-navbar-item"
          data-uk-icon="icon: table; ratio: 2"
          data-uk-toggle="target: #sidebar"
        />
      </div>
      <div className="uk-navbar-center">
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
    </nav>
  );
};

export default Navbar;
