const defExchangeState={
  symbol1:"BTC",
  symbol2:"USD",
  timeType:"data1h",
  fromTime:"",
  toTime:"",
}
const exchange=(state=defExchangeState,action)=>{
  switch (action.type) {
    case "SET_SYMBOLS":
      return {...state,symbol1:action.symbol1,symbol2:action.symbol2};
      break;
    case "SET_TIME_TYPE":
      return {...state,timeType:action.timeType};
      break;
    case "SET_FROM_TIME":
      return {...state,fromTime:action.fromTime};
      break;
    case "SET_TO_TIME":
      return {...state,toTime:action.toTime};
      break;
    default:
      return state;
  }
}
export default exchange;
