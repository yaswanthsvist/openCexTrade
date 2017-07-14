import webService from './../services/webService'
import webSocket from './../services/webSocket';
export const setOhlcv=(ohlcv)=>{
  return {
    type:"SET_PUBLIC_OHLCV",
    ohlcv,
  }
}
export const setChart=(chart)=>{
  return {
    type:"SET_PUBLIC_CHART",
    chart,
  }
}
export const setTrade_history=(trade_history)=>{
  return {
    type:"SET_PUBLIC_TRADE_HISTORY",
    trade_history,
  }
}
export const setLatest_price=(latest_price)=>{
  return {
    type:"SET_PUBLIC_LATEST_PRICE",
    latest_price,
  }
}
export const setCoin_market=(coin_market)=>{
  return {
    type:"SET_PUBLIC_COIN_MARKET",
    coin_market,
  }
}
export const setOrder_book=(order_book)=>{
  return {
    type:"SET_PUBLIC_ORDER_BOOK",
    order_book,
  }
}

/*
  fetchohlcv is a thunk

*/
export const fetchOhlcv=()=>{
  const time=(new Date()).getTime();

  const getPrevYYYYMMDD=(time=86400000)=>{
    const d=new Date(time-86400000);
    let mm = d.getMonth() + 1; // getMonth() is zero-based
    let dd = d.getDate();
    return `${d.getFullYear()}${mm>9?mm:'0'+mm}${dd>9?dd:'0'+dd}`;
  }

  return (dispatch,getState) =>{
    console.log(getState().exchange);
    const {symbol1,symbol2}=getState().exchange;
    const yyyymmdd=getPrevYYYYMMDD(time);
    const uri=`ohlcv/hd/${yyyymmdd}/${symbol1}/${symbol2}`;
    webService.get(uri).then(
      response=>{
        if(response!=null){
          console.log(response.time);
          dispatch(setOhlcv(response))
        }else {
          const yyyymmdd=getPrevYYYYMMDD(time-86400000); //48hrs back old data
          const uri=`ohlcv/hd/${yyyymmdd}/${symbol1}/${symbol2}`;
          webService.get(uri).then(
            response=>{
              if(response!=null){
                console.log(response.time);
                dispatch(setOhlcv(response))
              }else {
              }
            },
            error=>{
            }
          );
        }
      },
      error=>{
      }
    );

  }
}
