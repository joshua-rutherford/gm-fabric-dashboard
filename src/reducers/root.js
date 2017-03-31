import { combineReducers } from 'redux';
import { metrics } from './metrics';
import { settings } from './settings';

export default combineReducers({ metrics, settings });
