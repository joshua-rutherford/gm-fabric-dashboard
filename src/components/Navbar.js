import React from 'react';
import decipherLogo from '../images/decipherLogo.svg';
import gmLogo from '../images/gmFabricLogo.svg';

const Navbar = () => {
  return (
    <nav className="uk-navbar">
      <div className="uk-navbar-left">
        <div
          className="uk-navbar-item uk-logo"
        >
          <img
            alt='Decipher Logo'
            className="logo"
            src={decipherLogo}
            style={{ width: '20px' }}
          />
          <img
            alt='Gray Matter Logo'
            className="logo"
            id="product-logo"
            src={gmLogo}
            style={{ width: '20px' }}
          />
          <span
            className="logo"
            id="logo-text"
          >
            Fabric
          </span>
        </div>
      </div>
      <div className="uk-navbar-center">
        <form
          className="uk-search uk-search-default"
          onSubmit={(evt)=>{
            evt.preventDefault();
            alert('Doh! This search bar is not yet functional!');
          }}
        >
          <span data-uk-search-icon>&#128270;</span>
          <input className="uk-search-input" type="search" placeholder="Search..." />
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
