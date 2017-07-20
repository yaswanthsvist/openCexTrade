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

const screenTracking = ({ getState }) => next => (action) => {
  //console.log("screenTracking");
  if (
    action.type !== NavigationActions.NAVIGATE
    && action.type !== NavigationActions.BACK
  ) {
    return next(action);
  }
  console.log(action);
  const currentScreen = getCurrentRouteName(getState().nav);
  console.log(currentScreen);
  const result = next(action);
  console.log(result);
  const nextScreen = getCurrentRouteName(getState().nav);
  console.log(nextScreen);
  if (nextScreen !== currentScreen) {
    // the line below uses the Google Analytics tracker
    // change the tracker here to use other Mobile analytics SDK.
    console.log("screenTracking",nextScreen);
  }
  return result;
};

export default screenTracking;
