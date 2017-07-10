import { createStore } from 'redux';
import rootReducer from './reducers'
import {storeState,getStoredState} from './services/localStorage'
const persistedState=getStoredState()||{};
const store = createStore(rootReducer,persistedState);
store.subscribe(()=>{
    const {auth,exchange}=store.getState();
    console.log(auth);
    storeState({
        auth,
        exchange,
    })
})
export default store;
