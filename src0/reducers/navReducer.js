import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigation';

const nav=(state, action)=>{
  const newState = AppNavigator.router.getStateForAction(action, state);
  return newState || state;
}

export default nav;
