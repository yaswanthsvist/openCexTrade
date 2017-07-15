let wsBitfinex= {};
wsBitfinex.socket=null;
wsBitfinex.listners=[];
wsBitfinex.addListener=(listner)=>{
    wsBitfinex.listners.push(listner);
};
wsBitfinex.init=(listners)=>{
    const url="wss://api.bitfinex.codm/ws/2/";
    let socket=null;
    let d=new Promise((resolve,reject)=>{
      socket=new WebSocket("wss://api.bitfinex.com/ws/2/");
      socket.onmessage=(evt)=>{
//        console.log("socket message with Bitfinex",evt.data);
        try{
          wsBitfinex.listners.forEach(listner=>listner(evt));
        }catch(err){
          console.log(err);
        }
      };
      socket.onclose=(evt)=>{
        reject(evt);
        console.log("socket closed with Bitfinex",evt);
      };
      socket.onerror=(evt)=>{
        reject(evt);
        console.log("socket error with Bitfinex",evt);
      };
      socket.onopen=()=>{
        console.log("socket Opened with Bitfinex");
        wsBitfinex.socket=socket;
        resolve(socket);
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
export default wsBitfinex;
