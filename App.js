import React from 'react';
import AppWithNavigationState from './src/navigation'
import {Provider} from 'react-redux';
import store from './src/configureStore';
import {View, StatusBar } from 'react-native'
export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 ,backgroundColor:"#474747"}}>
        <StatusBar  backgroundColor="blue"  barStyle = "light-content" hidden = {true}/>
        <Provider store={store}>
          <AppWithNavigationState></AppWithNavigationState>
        </Provider>
      </View>
    );
  }
}
