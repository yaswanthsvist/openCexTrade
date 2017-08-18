import exchange from './../src/reducers/account';
import expect from 'expect'
import deepFreeze from 'deep-freeze';
const expectedDefaultState={
  symbol1:"BTC",
  symbol2:"USD",
  timeType:"data1h",
  fromTime:"",
  toTime:"",
}
describe("exchange",()=>{
  it('set symbols', () => {
    let action={
      "type":"SET_SYMBOLS",
      'symbol1':'ETH',
      'symbol2':'USD'
    }
    let initialState=exchange(undefined,{type:""});
    deepFreeze(initialState);
    let newState=exchange(initialState,action);
    expectedNewState={...expectedDefaultState,symbol1:"ETH",symbol2:"USD"}
    expect(newState).toEqual(expectedNewState);
  });
  it('set timeType', () => {
    let action={
      "type":"SET_TIME_TYPE",
      'timeType':'data1d',
    }
    let initialState=exchange(undefined,{type:""});
    deepFreeze(initialState);
    let newState=exchange(initialState,action);
    expectedNewState={...expectedDefaultState,timeType:"data1d"}
    expect(newState).toEqual(expectedNewState);
  });
  it('set fromTime', () => {
    const fromTime=(new Date()).getTime();
    let action={
      "type":"SET_FROM_TIME",
      fromTime,
    }
    let initialState=exchange(undefined,{type:""});
    deepFreeze(initialState);
    let newState=exchange(initialState,action);
    expect(newState.fromTime).toEqual(fromTime);
  });
  it('set toTime', () => {
    const toTime=(new Date()).getTime();
    let action={
      "type":"SET_TO_TIME",
      toTime,
    }
    let initialState=exchange(undefined,{type:""});
    deepFreeze(initialState);
    let newState=exchange(initialState,action);
    expect(newState.toTime).toEqual(toTime);
  });
});
