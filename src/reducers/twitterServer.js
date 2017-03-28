import { RECEIVE_TWITTERSERVER_DATA } from '../constants';

// Reducers
export const twitterServer = (state = {}, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case RECEIVE_TWITTERSERVER_DATA:
      newState = action.data;
      break;
    default:
      return state;
  }
  return newState;
};
