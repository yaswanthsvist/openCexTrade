import public_data from './../src/reducers/public_data';
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
const defSocketData={
  bitfinex:{
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
  it('subscribe' , () => {
    const action = {
     type:"BITFINEX_SUBSCRIBE_CANDLE",
     event: "subscribe",
     channel: "candles",
     key: "trade:1m:tBTCUSD"
    }
  })
  it('unsubscribe' , () => {
    const action = {
     type:"BITFINEX_UNSUBSCRIBE_CANDLE",
     "event": "unsubscribe",
     "chanId": CHANNEL_ID
    }
  })
})
