import { combineReducers } from 'redux';
import nav from './navReducer';
import exchange from './exchange';
import auth,{password} from './auth';
import public_data,{bitfinex} from './public_data';

rootReducer=combineReducers({
  nav,
  exchange,
  auth,
  password,
  public_data,
  bitfinex,
})
export default rootReducer;
