import React, { Component, PropTypes } from 'react';
import Navbar from './Navbar';
import OffCanvasSidebar from './OffCanvasSidebar';
import OnCanvasSidebar from './OnCanvasSidebar';
import { Actions } from 'jumpstate';

class Container extends Component {
  static propTypes = {
    children: PropTypes.any
  }

  // Perform an initial fetch of metrics on mount.
  // This triggers hooks which initialize polling using the default parameters
  componentDidMount() {
    Actions.fetchMetrics();
  }

  render() {
    return (
      <div className="uk-offcanvas-content">
        <OffCanvasSidebar />
        <div className="uk-container uk-container-expand ">
          <Navbar />
          <div
            className="uk-background-muted"
            data-uk-grid
            data-uk-grid-margin
          >
            <div className="uk-width-1-5@m uk-width-1-6@l uk-visible@m uk-tile uk-tile-default on-canvas-sidebar">
              <OnCanvasSidebar />
            </div>
            <main className="uk-width-4-5@m uk-width-5-6@l">
              {this.props.children}
            </main>
          </div>
        </div>
      </div>
    );
  };
}

export default Container;
