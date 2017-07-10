import webService from './../services/webService'
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

/*
  fetchohlcv is a thunk

*/
export const fetchohlcv=(exchange,dispatch,time=(new Date()).getTime())=>{
  const yyyymmdd=getPrevYYYYMMDD(time);
  const {symbol1,symbol2}=exchange;
  const uri=`ohlcv/hd/${yyyymmdd}/${symbol1}/${symbol2}`;
  return (dispatch)=>
    webService.get(uri).then(
      response=>{
        if(response==null){

        }else {
          console.log(response.time);
        }
      },
      error=>{

      }
    );
}

const getPrevYYYYMMDD=(time=86400000)=>{
  const d=new Date(time-86400000);
  let mm = d.getMonth() + 1; // getMonth() is zero-based
  let dd = d.getDate();

  return [d.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
}
