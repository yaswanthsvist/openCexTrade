import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigation';

const nav=(state, action)=>{
  console.log(state);
  const newState = AppNavigator.router.getStateForAction(action, state);
  console.log(newState);
  return newState || state;
}

export default nav;
