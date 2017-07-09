import auth from './../src/reducers/auth';
import expect from 'expect'
import deepFreeze from 'deep-freeze';
const defaultAuthState={
  apikey30per:"",
  encryptedKey:"",
  encryptedSecret:"",
  userid:'',
}
const defaultCredentials={
  apikey:"",
  apisecret:"",
}
describe("auth",()=>{
  it('set keys', () => {
    let action={
      "type":"SET_SAFE_KEYS",
      api20per:"************2e5mD4",
      encryptedKey:"ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504",
      userid:'up90990292',
    }
    let initialState=exchange(undefined,{type:""});
    deepFreeze(initialState);
    let newState=exchange(initialState,action);
    expectedNewState={...expectedDefaultState,symbol1:"ETH",symbol2:"USD"}
    expect(newState).toEqual(expectedNewState);
  });
});
describe("credentials",()=>{
  it('set keys', () => {
    let action={
      "type":"SET_API_KEY",
      apikey:"efWE32fsFg38KDNSD2e5mD4",
    }
    let initialState=exchange(undefined,{type:""});
    deepFreeze(initialState);
    let newState=exchange(initialState,action);
    expectedNewState={...expectedDefaultState,symbol1:"ETH",symbol2:"USD"}
    expect(newState).toEqual(expectedNewState);
  });
});
