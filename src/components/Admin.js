import React, { Component } from 'react';

class Admin extends Component {
  render() {
    return (
      <div>
        <div
          className="uk-grid-match uk-grid-small uk-text-center"
          data-uk-grid
        >
          <div className="uk-width-1-2@m">
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title">Polling Settings</h3>
              <img
                alt="Fill Murray"
                src="https://placeimg.com/300/200/animals"
              />
            </div>
          </div>
          <div className="uk-width-1-2@m">
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title">User Preferences</h3>
              <img
                alt="Fill Murray"
                src="https://placeimg.com/300/200/arch"
              />
            </div>
          </div>
          <div className="uk-width-1-2@m">
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title">Notification Settings</h3>
              <img
                alt="Fill Murray"
                src="https://placeimg.com/300/200/nature"
              />
            </div>
          </div>
          <div className="uk-width-1-2@m">
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title">Fauna Breeding</h3>
              <img
                alt="Fill Murray"
                src="https://placeimg.com/300/200/people"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;
