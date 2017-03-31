import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import Container from './components/Container';
import store from './store';
import SummaryGrid from './components/SummaryGrid';
import HTTPGrid from './components/HTTPGrid';
import JVMGrid from './components/JVMGrid';
import FinagleGrid from './components/FinagleGrid';
import SettingsGrid from './components/SettingsGrid';
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
      >
        <IndexRoute
          component={SummaryGrid}
        />
        <Route
          component={HTTPGrid}
          path="http"
        />
        <Route
          component={JVMGrid}
          path="jvm"
        />
        <Route
          component={FinagleGrid}
          path="finagle"
        />
        <Route
          component={SettingsGrid}
          path="settings"
        />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
