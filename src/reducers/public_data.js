const defState={
  ohlcv:null,
  latest_price:null,
  trade_history:null,
  coin_market:null,
  chart:null,
  order_book:null,
}
const public_data=(state=defState,action)=>{
  switch (action.type) {
    case "SET_PUBLIC_OHLCV":
      return {...state,ohlcv:action.ohlcv};
      break;
    case "SET_PUBLIC_LATEST_PRICE":
      return {...state,latest_price:action.latest_price};
      break;
    case "SET_PUBLIC_TRADE_HISTORY":
      return {...state,trade_history:action.trade_history};
      break;
    case "SET_PUBLIC_COIN_MARKET":
      return {...state,coin_market:action.coin_market};
      break;
    case "SET_PUBLIC_CHART":
      return {...state,chart:action.chart};
      break;
    case "SET_PUBLIC_ORDER_BOOK":
      return {...state,order_book:action.order_book};
      break;
    default:
      return state;
  }
}
const defBitfinexState={
  "candles":{
    key:'trade:1m:tBTCUSD',
    data:[],
    chanId:null,
 },
 "books":{
   symbol:'tBTCUSD',
   presentableData:{},
   barsData:{},
   chanId:null,
   prec: "P0",
   "freq": "F0",
   "len": 50,
 }
}
const candles=(state=defBitfinexState.candles,action)=>{
  switch (action.type) {
    case "BITFINEX_SUBSCRIBED_CANDLE":
      return {
          key:action.key,
          data:[],
          chanId:action.chanId,
      };
      break;
    case "BITFINEX_UNSUBSCRIBED_CANDLE":
      return {
          ...state,
          data:[],
          chanId:null,
      };
      break;
    case "BITFINEX_INITIALIZE_CANDLE":
      if(state.chanId!=action.chanId){
        return state;
      }
      return {
          ...state,
          data:[...action.data],
      }
    case "BITFINEX_UPDATE_CANDLE":
         if(state.chanId!=action.chanId||state.data[0][0]>action.data[0]){
           return state;
         }
         if(state.data[0][0]===action.data[0]){
          return {
              ...state,
              data:[action.data,...state.data.slice(1)],
          }
        }else if(state.data[0][0]<action.data[0]){
          return {
              ...state,
              data:[action.data,...state.data],
          }
        }
    default:
    return state;
  }
}
const books=(state=defBitfinexState.books,action)=>{
  switch (action.type) {
    case "BITFINEX_SUBSCRIBED_BOOK":
          {
            const {chanId,freq,prec,len,symbol}=action;
            return {
              presentableData:{},
              barsData:{},
              chanId,freq,prec,len,symbol,
            };
          }
      break;
    case "BITFINEX_UNSUBSCRIBED_BOOK":
      return {
          ...state,
          presentableData:{},
          barsData:{},
          chanId:null,
      };
      break;
    case "BITFINEX_UPDATE_BOOK":
      if(state.chanId!=action.chanId){
        return state;
      }
      return {
          ...state,
          presentableData:{...action.presentableData},
          barsData:{...action.barsData},
      }
    default:
    return state;
  }
}
export const bitfinex=(state=defBitfinexState,action)=>{
  switch (action.type) {
    case "BITFINEX_SUBSCRIBED_CANDLE":
    case "BITFINEX_UNSUBSCRIBED_CANDLE":
    case "BITFINEX_INITIALIZE_CANDLE":
    case "BITFINEX_UPDATE_CANDLE":
        return {
          ...state,
          candles:candles(state.candles,action),
        }
        break;
    case "BITFINEX_SUBSCRIBED_BOOK":
    case "BITFINEX_UNSUBSCRIBED_BOOK":
    case "BITFINEX_UPDATE_BOOK":
        return {
          ...state,
          books:books(state.books,action),
        }
        break;
    default:
      return state;
  }
}


export default public_data;
