import { createStore , applyMiddleware  } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers'
import {storeState,getStoredState} from './services/localStorage'
import screenTracking from './navigation/screenTracking';
import throttle from 'lodash/throttle';
const persistedState=getStoredState()||{};
const store = createStore(
  rootReducer,
  persistedState,
  applyMiddleware(
    thunk,
    screenTracking,
  ),
);
store.subscribe(throttle(()=>{
    const {auth,exchange,public_data}=store.getState();
    storeState({
        auth,
        exchange,
    })
},2000))
export default store;
