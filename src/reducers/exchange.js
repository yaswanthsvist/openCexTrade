const defExchangeState={
  symbol1:"BTC",
  symbol2:"USD",
  timeType:"data1m",
  fromTime:"",
  toTime:"",
}
const exchange=(state=defExchangeState,action)=>{
  switch (action.type) {
    case "SET_SYMBOL1":
      return {...state,symbol1:action.symbol1};
      break;
    case "SET_SYMBOL2":
      return {...state,symbol2:action.symbol2};
      break;
    case "SET_TIME_TYPE":
      return {...state,timeType:action.timeType};
      break;
    case "SET_FROM_DATE":
      return {...state,fromDate:action.fromDate};
      break;
    case "SET_TO_DATE":
      return {...state,toDate:action.toDate};
      break;
    default:
      return state;
  }
}
export default exchange;
