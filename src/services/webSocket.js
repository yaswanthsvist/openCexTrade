let BOOK = {
  bids : {},
  asks : {},
  psnap : {},
  mcnt : 0,
};
let wsBitfinex= {};
wsBitfinex.socket=null;
wsBitfinex.listners=[];
wsBitfinex.addListener=(listner)=>{
    wsBitfinex.listners.push(listner);
};
wsBitfinex.isReady=(listners)=>{
    const url="wss://api.bitfinex.codm/ws/2/";
    let d=new Promise((resolve,reject)=>{
      if(wsBitfinex.socket==WebSocket.OPEN){
        resolve(wsBitfinex.socket);
      }
      wsBitfinex.socket=new WebSocket("wss://api.bitfinex.com/ws/2/");
      wsBitfinex.socket.onmessage=(evt)=>{
//        console.log("socket message with Bitfinex",evt.data);
        try{
          wsBitfinex.listners.forEach(listner=>listner(JSON.parse(evt.data)));
        }catch(err){
          console.log(err);
        }
      };
      wsBitfinex.socket.onclose=(evt)=>{
        reject(evt);
        console.log("socket closed with Bitfinex",evt);
      };
      wsBitfinex.socket.onerror=(evt)=>{
        reject(evt);
        console.log("socket error with Bitfinex",evt);
      };
      wsBitfinex.socket.onopen=()=>{
        console.log("socket Opened with Bitfinex");
        resolve(wsBitfinex.socket);
      };
    });
    return d;
};
wsBitfinex.send=(obj)=>{
  if(wsBitfinex.socket.readyState==WebSocket.OPEN){
    wsBitfinex.socket.send(JSON.stringify(obj));
    return true;
  }else{
    return false;
  }
}

const checkCross = (msg) => {
  let bid = BOOK.psnap.bids[0]
  let ask = BOOK.psnap.asks[0]
  if (bid >= ask) {
  //  console.log( "bid(" + bid + ")>=ask(" + ask + ")");
  }
}

wsBitfinex.handleBook =(msg,dispatch,chanId,bitfinexActions)=> {
    if(msg[0]!=chanId||msg[1]=='hb'){
      return;
    }
//    console.log(BOOK);
    if (BOOK.mcnt === 0||msg[1].length>=5) {
        BOOK = {
          bids : {},
          asks : {},
          psnap : {},
          mcnt : 0,
        };
        msg[1].forEach( (pp)=>{
        pp = { price: pp[0], cnt: pp[1], amount: pp[2] }
        const side = pp.amount >= 0 ? 'bids' : 'asks'
        pp.amount = Math.abs(pp.amount)
        BOOK[side][pp.price] = pp
      })
    }
    else {
      let pp = { price: msg[1][0], cnt: msg[1][1], amount: msg[1][2] }
      if (!pp.cnt) {
        let found = true
        if (pp.amount > 0) {
          if (BOOK['bids'][pp.price]) {
            delete BOOK['bids'][pp.price]
          } else {
            found = false
          }
        } else if (pp.amount < 0) {
          if (BOOK['asks'][pp.price]) {
            delete BOOK['asks'][pp.price]
          } else {
            found = false
          }
        }
        if (!found) {
      //    console.log(JSON.stringify(pp) + " BOOK delete fail side not found\n");
        }
      } else {
        let side = pp.amount >= 0 ? 'bids' : 'asks'
        pp.amount = Math.abs(pp.amount)
        BOOK[side][pp.price] = pp
      }
    }

    let sides=['bids', 'asks'];
    let presentableData={},barsData={};
    sides.forEach( (side)=>{
      let sbook = BOOK[side]
      let bprices = Object.keys(sbook)

      let prices = bprices.sort(function(a, b) {
        if (side === 'bids') {
          return +a >= +b ? -1 : 1
        } else {
          return +a <= +b ? -1 : 1
        }
      })

      BOOK.psnap[side] = prices;
      //console.log("num price points", side, prices.length)
      let list=[],amount=0;
      for (let price of prices){
        list.push([price, ( amount += BOOK[side][price].amount ) ] );
      };
      presentableData[side]=list;
      barsData[side]=prices.map(price=>[price,BOOK[side][price].amount]);
    });
    BOOK.mcnt++;
    checkCross(msg)
    dispatch( bitfinexActions.updateBooksData({presentableData,barsData,chanId}) );
  }



export default wsBitfinex;
