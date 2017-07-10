import auth,{password} from './../src/reducers/auth';
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
      encryptedSecret:"ZadDSE234tvsd9FS3dzx",
      userid:'up32dmds3223',
    }
    deepFreeze(defaultAuthState);
    let newState=auth(defaultAuthState,action);
    expect(newState.userid).toEqual("up32dmds3223");
  });
  it('set password initail to be null', () => {
    let action={
      type:"SET_PASSWORDD",
      password:'',
    }
    let newState=password(undefined,action);
    expect(newState).toEqual(null);
  });
  it('set password initail to be null', () => {
    let action={
      type:"SET_PASSWORD",
      password:'2132423',
    }
    let newState=password(undefined,action);
    expect(newState).toEqual('2132423');
  });
});
