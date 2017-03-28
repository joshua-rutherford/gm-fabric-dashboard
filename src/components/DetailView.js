import React from 'react';

const DetailView = () => {
  return (
    <div>
      <h1 className="uk-heading-line uk-text-center"><span>Summary</span></h1>
      <div
        className="uk-grid-match uk-grid-small uk-text-center"
        data-uk-grid
      >
        <div className="uk-width-1-2@m">
          <div className="uk-card uk-card-default uk-card-body">
            <h3 className="uk-card-title">Reticulated Splines</h3>
            <img
              alt="Fill Murray"
              src="https://placeimg.com/300/200/animals"
            />
          </div>
        </div>
        <div className="uk-width-1-2@m">
          <div className="uk-card uk-card-default uk-card-body">
            <h3 className="uk-card-title">Advisor Moods</h3>
            <img
              alt="Fill Murray"
              src="https://placeimg.com/300/200/arch"
            />
          </div>
        </div>
        <div className="uk-width-1-2@m">
          <div className="uk-card uk-card-default uk-card-body">
            <h3 className="uk-card-title">Random Walks</h3>
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
        <div className="uk-width-1-2@m">
          <div className="uk-card uk-card-default uk-card-body">
            <h3 className="uk-card-title">Feng Shui Rating</h3>
            <img
              alt="Fill Murray"
              src="https://placeimg.com/300/200/tech"
            />
          </div>
        </div>
        <div className="uk-width-1-2@m">
          <div className="uk-card uk-card-default uk-card-body">
            <h3 className="uk-card-title">Sublimated Messages</h3>
            <img
              alt="Fill Murray"
              src="https://placeimg.com/350/200/animals"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
