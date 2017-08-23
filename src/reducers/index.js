import { combineReducers } from 'redux';
import nav from './navReducer';
import exchange from './exchange';
import auth,{password} from './auth';
import account from './account';
import public_data,{bitfinex} from './public_data';

const screen=(state="Exchange",action)=>{
  switch (action.type) {
    case "SET_CURRENT_SCREEN":
      return action.screen;
      break;
    default:
      return state;
  }
}


rootReducer=combineReducers({
  nav,
  exchange,
  auth,
  account,
  password,
  public_data,
  bitfinex,
  screen,
})
export default rootReducer;
