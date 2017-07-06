import { combineReducers } from 'redux';
import nav from './navReducer';
import exchange from './exchange';

rootReducer=combineReducers({
  nav,
  exchange
})
export default rootReducer;
