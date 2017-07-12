import { createStore , applyMiddleware  } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers'
import {storeState,getStoredState} from './services/localStorage'
const persistedState=getStoredState()||{};
const store = createStore(
  rootReducer,
  persistedState,
  applyMiddleware(thunk),
);
store.subscribe(()=>{
    const {auth,exchange,public_data}=store.getState();
    if(public_data.ohlcv)
    console.log(public_data.ohlcv.time);
    storeState({
        auth,
        exchange,
    })
})
export default store;
