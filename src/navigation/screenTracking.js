import { NavigationActions } from 'react-navigation';



function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

const screenTracking = ({ getState,dispatch }) => next => (action) => {
  //console.log("screenTracking");
  if (
    action.type !== NavigationActions.NAVIGATE
    && action.type !== NavigationActions.BACK
  ) {
    return next(action);
  }
  const currentScreen = getCurrentRouteName(getState().nav);
  const result = next(action);
  const nextScreen = getCurrentRouteName(getState().nav);
  if (nextScreen !== currentScreen) {
    // the line below uses the Google Analytics tracker
    // change the tracker here to use other Mobile analytics SDK.
    console.log("screenTracking",nextScreen);
    dispatch({type:"SET_CURRENT_SCREEN",screen:nextScreen});
  }
  return result;
};

export default screenTracking;
