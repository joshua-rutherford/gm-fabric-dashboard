import React, { Component } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DetailView from './DetailView';

class Container extends Component {
  render() {
    return (
      <div>
        <Sidebar />
        <div className="uk-container uk-background-muted">
          <Navbar />
          <DetailView />
        </div>
      </div>
    );
  };
}

export default Container;
