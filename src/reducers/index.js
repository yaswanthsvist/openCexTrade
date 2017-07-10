import { combineReducers } from 'redux';
import nav from './navReducer';
import exchange from './exchange';
import auth,{password} from './auth';

rootReducer=combineReducers({
  nav,
  exchange,
  auth,
  password,
  
})
export default rootReducer;
