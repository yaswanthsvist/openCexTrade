import { createStore } from 'redux';
import rootReducer from './reducers'
import {storeState,getStoredState} from './services/localStorage'
const persistedState=getStoredState()||{};
const store = createStore(rootReducer,persistedState);
store.subscribe((state)=>{
    storeState({
      exchange:{},
      "auth":{"api30":"",lockedKey:""},
      "coinAddresses":{"ETH":"","BTC":""},
      bids:{},
      trade:{},
    })
})
export default store;
