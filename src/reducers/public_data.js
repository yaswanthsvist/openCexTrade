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
export default public_data;
