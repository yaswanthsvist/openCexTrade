import exchange from './../src/reducers/exchange';
import expect from 'expect'
import deepFreeze from 'deep-freeze';
const expectedDefaultState={
  symbol1:"BTC",
  symbol2:"USD",
  timeType:"data1m",
  fromTime:"",
  toTime:"",
}
describe("exchange",()=>{
  it('set symbol1', () => {
    let action={
      "type":"SET_SYMBOL1",
      'symbol1':'ETH'
    }
    deepFreeze(expectedDefaultState);
    expectedNewState={...expectedDefaultState,symbol1:"ETH"}
    let newState=exchange(expectedDefaultState,action);
    expect(expectedDefaultState.symbol1).toEqual('BTC');
    expect(newState).toEqual(expectedNewState);
  });
});
