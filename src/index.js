import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import Container from './components/Container';
import store from './store';
import '../node_modules/uikit/dist/css/uikit.min.css';
import './style/index.css';

// load the UIKit Icon plugin
UIkit.use(Icons);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} >
      <Route
        component={Container}
        path="/"
      />
    </Router>
  </Provider >,
  document.getElementById('root')
);
