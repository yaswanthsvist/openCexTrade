import React from 'react';
import {connect} from 'react-redux';
import * as bitfinexActions from './../actions/bitfinex';
import { StyleSheet,Dimensions, Text,Button, View,ScrollView,StatusBar,Image } from 'react-native';
import wsBitfinex from './../services/webSocket';
import MarketDepth from './ui/MarketDepth';
import BarChart from './ui/BarChart';
import CandleChart from './ui/CandleChart';

let BOOK = {
  bids : {},
  asks : {},
  psnap : {},
  mcnt : 0,
}
let bookChannelid=null;
const checkCross = (msg) => {
  let bid = BOOK.psnap.bids[0]
  let ask = BOOK.psnap.asks[0]
  if (bid >= ask) {
    console.log( "bid(" + bid + ")>=ask(" + ask + ")");
  }
}
const handleBook =(msg,dispatch,chanId)=> {
    if(msg[0]!=chanId||msg[1]=='hb'){
      return;
    }
  //  console.log(msg[1]);
    if (BOOK.mcnt === 0) {
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
          console.log(JSON.stringify(pp) + " BOOK delete fail side not found\n");
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



class Trade extends React.Component{
  constructor(props){
    super(props)
    const candleChannleHandler=(msg)=>{
      const {bitfinex,dispatch}=this.props;
      if( !Array.isArray( msg ) && msg.event == "subscribed" ){
        if( msg.channel == "candles" ){
          dispatch( bitfinexActions.subscribeToCandles( msg ) );
        }
        if( msg.channel == "book" ){
          console.log(msg.channel);
          dispatch( bitfinexActions.subscribedToBook( msg ) );
        }
      } else if( Array.isArray( msg ) ){
        handleBook(msg,dispatch,bitfinex.books.chanId);
        const data = msg[1];
        const chanId = msg[0];
        if( Array.isArray( data ) && chanId == bitfinex.candles.chanId ){
          if( Array.isArray(data[0]) ){
            dispatch( bitfinexActions.initializeCandlesData( { data , chanId } ) )
          }else{
            dispatch (bitfinexActions.updateCandlesData( { data , chanId } ) );
          }
        }
      }
    }
    this.state={};
    wsBitfinex.addListener(candleChannleHandler);
    wsBitfinex.init().then(()=>{
        wsBitfinex.send({
                "event": "subscribe",
                "channel": "candles",
                "key": "trade:1m:tBTCUSD"
              });
        wsBitfinex.send({
            event: "subscribe",
            channel: "book",
            pair:"tBTCUSD" ,
            prec: "P0",
            "freq": "F3",
            "len": 25
          });
      }
    );
  }
  componentWillReceiveProps(nextProps) {
    const {data}=this.props.bitfinex.candles;
    if(
      nextProps.bitfinex.candles.data!=null &&
      data != null &&
      data.length != nextProps.bitfinex.candles.data.length
    ){
//      console.log(nextProps.bitfinex.candles.data[0]);
    }
  }
  static navigationOptions={
    title:"Trade",
    drawerLabel: 'Home',
    tabBarLabel: 'Trade',
  }
  render(){
    const { presentableData , barsData }=this.props.bitfinex.books;
    const {data}=this.props.bitfinex.candles;
    return(
      <View>
        {/*
        <MarketDepth width={Dimensions.get('screen').width} height={Dimensions.get('screen').height/3} data={presentableData}></MarketDepth>
        <BarChart width={Dimensions.get('screen').width} height={Dimensions.get('screen').height/3} data={barsData}></BarChart>
        */}
        <CandleChart width={Dimensions.get('screen').width} height={Dimensions.get('screen').height/3} data={data}></CandleChart>
        <Text>Trade here</Text>
      </View>
    )
  }
}




const mapStateToProps = state => ({
  bitfinex:state.bitfinex,
});
export default connect(mapStateToProps)(Trade);
