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
export const updateBooksData=({presentableData,chanId})=>{
  return {
    type:"BITFINEX_UPDATE_BOOK",
    presentableData,
    chanId,
  }
}
