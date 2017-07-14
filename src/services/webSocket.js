const wsBitfinex= {
  socket:null,
  init:()=>{
    const url="wss://api.bitfinex.codm/ws/2/";
    console.log(url);
    this.socket=new WebSocket("wss://api.bitfinex.com/ws/2/");
    this.socket.onopen=()=>{
      console.log("socket Opened with Bitfinex");
    };
    this.socket.onmessage=(evt)=>{
      console.log("socket message with Bitfinex",evt);
    };
    this.socket.onclose=(evt)=>{
      console.log("socket closed with Bitfinex",evt);
    };
    this.socket.onerror=(evt)=>{
      console.log("socket error with Bitfinex",evt);
    }
  }
}

export default wsBitfinex;
