export const setTimeType=(timeType)=>{
  return {
    type:"SET_TIME_TYPE",
    timeType,
  }
}
export const setSymbols=(symbol1,symbol2)=>{
  return {
    type:"SET_SYMBOLS",
    symbol1,
    symbol2,
  }
}

export const setFromTime=(fromTime)=>{
  return {
    type:"SET_FROM_TIME",
    fromTime,
  }
}
export const setToTime=(toTime)=>{
  return {
    type:"SET_TO_TIME",
    toTime,
  }
}
