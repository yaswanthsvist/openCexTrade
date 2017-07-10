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


export const fetchohlcv=(exchange,dispatch,time=(new Date()).getTime())=>{
  if( ( ( new Date() ).getTime()  -time ) >= (86400000*3) ){ //if the difference in time is more than 3 days return {}
    return {};
  }
  const yyyymmdd=getPrevYYYYMMDD(time);
  const {symbol1,symbol2}=exchange;
  const uri=`ohlcv/hd/${yyyymmdd}/${symbol1}/${symbol2}`;
  webService.get(uri).then(response=>{
    if(response==null){
      fetchohlcv(exchange,dispatch,time-8640000); // 1 day=8640000 milliseconds
    }else {
      console.log(response.time);
    }
  });
}

const getPrevYYYYMMDD=(time)=>{
  const d=new Date(time-86400000);
  let mm = d.getMonth() + 1; // getMonth() is zero-based
  let dd = d.getDate();

  return [d.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
}
