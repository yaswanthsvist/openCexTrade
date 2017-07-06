import React from 'react';
import AppWithNavigationState from './src/navigation'
import {Provider} from 'react-redux';
import store from './src/configureStore';
export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState></AppWithNavigationState>
      </Provider>
    );
  }
}
