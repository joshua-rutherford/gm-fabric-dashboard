import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import reduxPromise from 'redux-promise';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers/root';

export default createStore(
  rootReducer,
  applyMiddleware(
    reduxPromise,
    thunkMiddleware,
    createLogger({ collapsed: true })
  )
);
