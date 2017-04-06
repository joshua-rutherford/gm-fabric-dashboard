import React from 'react';
import OnCanvasSidebar from './OnCanvasSidebar';

const Sidebar = () => {
  return (
    <div
      data-uk-offcanvas="mode: push; overlay: true"
      id="sidebar"
    >
      <div className="uk-offcanvas-bar">
        <button
          className="uk-offcanvas-close uk-align-right"
          data-uk-close
          type="button"
        />
        <OnCanvasSidebar />
      </div>
    </div>
  );
};

export default Sidebar;
