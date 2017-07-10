import auth from './../src/reducers/auth';
import expect from 'expect'
import deepFreeze from 'deep-freeze';
const defaultAuthState={
  apikey30per:"",
  encryptedKey:"",
  encryptedSecret:"",
  userid:'',
}
describe("auth",()=>{
  it('set keys', () => {
    let action={
      type:"SET_SAFE_KEYS",
      apiKey33per:"************2e5mD4",
      encryptedKey:"ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504",
      encryptedSecret:"ZadDSE234tvsd9FS3dzx"
      userid:'up32dmds3223',
    }
    let initialState=auth(undefined,{type:""});
    deepFreeze(initialState);
    let newState=authState(initialState,action);
    expectedNewState={...expectedDefaultState,symbol1:"ETH",symbol2:"USD"}
    expect(newState).toEqual(expectedNewState);
  });
});
