import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigation';

const nav=(state, action)=>{
//  console.log("navReducer-action",action);
  const newState = AppNavigator.router.getStateForAction(action, state);
  if(action.type==="Navigation/NAVIGATE"){
    return {...newState,currentRouteName:action.routeName };
  }
  if(newState){
    return {...state,...newState}
  }else{
    return state
  }

}

export default nav;
