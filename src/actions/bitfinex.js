export const initializeCandlesData=({data,chanId})=>{
  return {
    type:"BITFINEX_INITIALIZE_CANDLE",
    chanId,
    data,
  }
}
export const updateCandlesData=({data,chanId})=>{
  return {
    type:"BITFINEX_UPDATE_CANDLE",
    chanId,
    data,
  }
}
export const updateTickerData=({data,chanId})=>{
  return {
    type:"BITFINEX_UPDATE_TICKER",
    chanId,
    data,
  }
}
export const subscribeToCandles=({key,chanId})=>{
  return {
    type:"BITFINEX_SUBSCRIBED_CANDLE",
    chanId,
    key,
  }
}
export const subscribedToBook=(evt)=>{
  return {
    type:"BITFINEX_SUBSCRIBED_BOOK",
    ...evt,
  }
}
export const subscribedToTicker=(evt)=>{
  return {
    type:"BITFINEX_SUBSCRIBED_TICKER",
    ...evt,
  }
}
export const updateBooksData=({presentableData,barsData,chanId})=>{
  return {
    type:"BITFINEX_UPDATE_BOOK",
    presentableData,
    barsData,
    chanId,
  }
}
