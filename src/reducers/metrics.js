import { FETCH_METRICS } from '../actions/index';

// Reducers
export function metrics(state = [], action) {
  switch (action.type) {
    case FETCH_METRICS:
      return [...state, {date: Date.now(), data: action.payload}];
    default:
      return state;
  }
};
