import public_data,{bitfinex} from './../src/reducers/public_data';
import expect from 'expect'
import deepFreeze from 'deep-freeze';
const expectedDefaultState={
  ohlcv:null,
  latest_price:null,
  trade_history:null,
  coin_market:null,
  chart:null,
  order_book:null,
}
const defbitfinexData={
   "candles":{
     key:'trade:1m:tETHUSD',
     data:null,
     chanId:null,
  }
};

describe("public_data",()=>{
  it('get initail public', () => {
    let initialState=public_data(undefined,{type:""});
    expect(initialState).toEqual(expectedDefaultState);
  });
  it('set ohlcv', () => {
    let action={
      "type":"SET_PUBLIC_OHLCV",
      ohlcv:{time:'20170711'},
    }
    let newState=public_data(undefined,action);
    expect(newState.ohlcv).toEqual(action.ohlcv);
  });
  it('set latest_price', () => {
    let action={
      "type":"SET_PUBLIC_LATEST_PRICE",
      latest_price:{time:'20170711'},
    }
    let newState=public_data(undefined,action);
    expect(newState.latest_price).toEqual(action.latest_price);
  });
  it('set trade_history', () => {
    let action={
      "type":"SET_PUBLIC_TRADE_HISTORY",
      trade_history:{time:'20170711'},
    }
    let newState=public_data(undefined,action);
    expect(newState.trade_history).toEqual(action.trade_history);
  });
  it('set chart', () => {
    let action={
      "type":"SET_PUBLIC_CHART",
      chart:{time:'20170711'},
    }
    let newState=public_data(undefined,action);
    expect(newState.chart).toEqual(action.chart);
  });
  it('set coin_market', () => {
    let action={
      "type":"SET_PUBLIC_COIN_MARKET",
      coin_market:{time:'20170711'},
    }
    let newState=public_data(undefined,action);
    expect(newState.coin_market).toEqual(action.coin_market);
  });
  it('set order_book', () => {
    let action={
      "type":"SET_PUBLIC_ORDER_BOOK",
      order_book:{time:'20170711'},
    }
    let newState=public_data(undefined,action);
    expect(newState.order_book).toEqual(action.order_book);
  });
});
describe( 'Bitfinex  web Socket test cases',()=>{
  it('subscribed' , () => {
    const action = {
     type:"BITFINEX_SUBSCRIBED_CANDLE",
     key: "trade:1h:tETHUSD",
     chanId:54123,
    }
    const expectedState={
      "candles":{
        key:'trade:1h:tETHUSD',
        data:[],
        chanId:54123,
     }
    }
    let newState=bitfinex(undefined,action);
    expect(newState).toEqual(expectedState);
  })
  it('unsubscribe' , () => {
    const action = {
     type:"BITFINEX_UNSUBSCRIBED_CANDLE",
    }
    const initialState={
      "candles":{
        key:'trade:30m:tETHUSD',
        chanId:54123,
        data:[],
     }
    }
    const expectedState={
      "candles":{
        key:'trade:30m:tETHUSD',
        chanId:null,
        data:[],
      }
    }
    let newState=bitfinex(initialState,action);
    expect(newState).toEqual(expectedState);
  });
  it('initialize' , () => {
    const initialState={
      "candles":{
        key:'trade:30m:tETHUSD',
        chanId:27893,
        data:[],
      }
    }
    const action = {
     type:"BITFINEX_INITIALIZE_CANDLE",
     chanId:27893,
     data:[
          [
            1500055200000,
            2195.4,
            2209.7,
            2215,
            2174,
            2241.22567577
          ],
          [
            1500051600000,
            2194.9,
            2195.4,
            2197,
            2154.1,
            2707.78465686
          ],
          [
            1500048000000,
            2236.9,
            2194.9,
            2257.1,
            2171.1,
            4625.61552326
          ],
     ]
    }
    const expectedState={
      "candles":{
        chanId:27893,
        key:'trade:30m:tETHUSD',
        data:[
          [
            1500055200000,
            2195.4,
            2209.7,
            2215,
            2174,
            2241.22567577
          ],
          [
            1500051600000,
            2194.9,
            2195.4,
            2197,
            2154.1,
            2707.78465686
          ],
          [
            1500048000000,
            2236.9,
            2194.9,
            2257.1,
            2171.1,
            4625.61552326
          ],
        ],
     }
    }
    let newState=bitfinex(initialState,action);
    expect(newState).toEqual(expectedState);
  })
  it('update' , () => {
      const initialState={
        "candles":{
          chanId:27893,
          key:'trade:30m:tETHUSD',
          data:[
            [
              1500055200000,
              2195.4,
              2209.7,
              2215,
              2174,
              2241.22567577
            ],
            [
              1500051600000,
              2194.9,
              2195.4,
              2197,
              2154.1,
              2707.78465686
            ],
            [
              1500048000000,
              2236.9,
              2194.9,
              2257.1,
              2171.1,
              4625.61552326
            ],
          ],
        }
      }
      const action = {
       type:"BITFINEX_UPDATE_CANDLE",
       chanId:27893,
       data:[
          1500055200000,
          2196.4,
          2210.7,
          2216,
          2175,
          2242.22567577
       ]
      }
      const expectedState={
        "candles":{
          chanId:27893,
          key:'trade:30m:tETHUSD',
          data:[
            [
              1500055200000,
              2196.4,
              2210.7,
              2216,
              2175,
              2242.22567577
            ],
            [
              1500051600000,
              2194.9,
              2195.4,
              2197,
              2154.1,
              2707.78465686
            ],
            [
              1500048000000,
              2236.9,
              2194.9,
              2257.1,
              2171.1,
              4625.61552326
            ],
          ],
       }
      }
      let newState=bitfinex(initialState,action);
      expect(newState.candles.data).toEqual(expectedState.candles.data);
    });
  it('update should add new candle entry if its timestamp is greater than highest timestamp in available candle data' , () => {
    const initialState={
      "candles":{
        chanId:27893,
        key:'trade:30m:tETHUSD',
        data:[
          [
            1500055200000,
            2195.4,
            2209.7,
            2215,
            2174,
            2241.22567577
          ],
          [
            1500051600000,
            2194.9,
            2195.4,
            2197,
            2154.1,
            2707.78465686
          ],
          [
            1500048000000,
            2236.9,
            2194.9,
            2257.1,
            2171.1,
            4625.61552326
          ],
        ],
      }
    }
    const action = {
     type:"BITFINEX_UPDATE_CANDLE",
     chanId:27893,
     data:[
            1500058800000,
            2200.4,
            2210.7,
            2216,
            2175,
            2242.22567577
     ],
    }
    const expectedState={
      "candles":{
        chanId:27893,
        key:'trade:30m:tETHUSD',
        data:[
          [
            1500058800000,
            2200.4,
            2210.7,
            2216,
            2175,
            2242.22567577
          ],
          [
            1500055200000,
            2195.4,
            2209.7,
            2215,
            2174,
            2241.22567577
          ],
          [
            1500051600000,
            2194.9,
            2195.4,
            2197,
            2154.1,
            2707.78465686
          ],
          [
            1500048000000,
            2236.9,
            2194.9,
            2257.1,
            2171.1,
            4625.61552326
          ],
        ],
     }
    }
    let newState=bitfinex(initialState,action);
    expect(newState.candles.data).toEqual(expectedState.candles.data);
  });
  it('update should not add/update a candle entry if its timestamp is less than highest timestamp in available candle data' , () => {
    const initialState={
      "candles":{
        chanId:27893,
        key:'trade:30m:tETHUSD',
        data:[
          [
            1500055200000,
            2195.4,
            2209.7,
            2215,
            2174,
            2241.22567577
          ],
          [
            1500051600000,
            2194.9,
            2195.4,
            2197,
            2154.1,
            2707.78465686
          ],
          [
            1500048000000,
            2236.9,
            2194.9,
            2257.1,
            2171.1,
            4625.61552326
          ],
        ],
      }
    }
    const action = {
     type:"BITFINEX_UPDATE_CANDLE",
     chanId:27893,
     data:[
            1500051600000,
            2200.4,
            2210.7,
            2216,
            2175,
            2242.22567577
     ]
    }
    let newState=bitfinex(initialState,action);
    expect(newState).toEqual(initialState);
  });
  it('update should not add/update a candle entry if its channelid is not matching' , () => {
    const initialState={
      "candles":{
        chanId:27893,
        key:'trade:30m:tETHUSD',
        data:[
          [
            1500055200000,
            2195.4,
            2209.7,
            2215,
            2174,
            2241.22567577
          ],
          [
            1500051600000,
            2194.9,
            2195.4,
            2197,
            2154.1,
            2707.78465686
          ],
          [
            1500048000000,
            2236.9,
            2194.9,
            2257.1,
            2171.1,
            4625.61552326
          ],
        ],
      }
    }
    const action = {
     type:"BITFINEX_UPDATE_CANDLE",
     chanId:27894,
     data:[
            1500058800000,
            2200.4,
            2210.7,
            2216,
            2175,
            2242.22567577
     ]
    }
    let newState=bitfinex(initialState,action);
    expect(newState).toEqual(initialState);
  });
});
