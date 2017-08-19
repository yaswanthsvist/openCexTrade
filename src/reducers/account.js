const defState={
  balance:{
    "USD":1200,
    "BTC":0,
    "ETH":0,
  },
  orders:[],
  transactions:[],
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
const candles=(state=defBitfinexState.candles,action)=>{
  switch (action.type) {
    case "BITFINEX_SUBSCRIBED_CANDLE":
      return {
          key:action.key,
          data:[],
          chanId:action.chanId,
      };
      break;
    case "BITFINEX_UNSUBSCRIBE_CANDLE":
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
const orders=(state=defState.orders,action)=>{
  switch (action.type) {
    case "ADD_ORDER":
          {
            return [
              ...state,
              action.order,
            ];
          }
      break;
    case "UPDATE_ORDER":
      return [
          ...state.slice(0,action.index),
          {...action.order},
          ...state.slice(action.index+1),
      ];
      break;
    case "CANCEL_ORDER":
      return [
          ...state.slice(0,action.index),
          ...state.slice(action.index+1),
      ];
      break;
    case "CANCEL_ALL_ORDERS":
      return [];
      break;
    default:
    return state;
  }
}
const balance=(state=defState.balance,action)=>{
  switch (action.type) {
    case "UPDATE_BALANCE":
      {
        return {
          ...state,
          USD:action.USD,
          BTC:action.BTC,
          ETH: action.ETH,
        };
      }
      break;
    case "RESET_BALANCE":
      return {
          ...state,
          USD:1200,BTC:0,ETH:0,
      }
      break;
    default:
      return state;
  }
}
const account=(state=defState,action)=>{
  switch (action.type) {
    case "UPDATE_BALANCE":
    case "RESET_BALANCE":
        return {
          ...state,
          balance:balance(state.balance,action),
        }
        break;
    case "ADD_ORDER":
    case "UPDATE_ORDER":
    case "CANCEL_ORDER":
    case "CANCEL_ALL_ORDERS":
        return {
          ...state,
          orders:orders(state.orders,action),
        }
        break;
    default:
      return state;
  }
}


export default account;
