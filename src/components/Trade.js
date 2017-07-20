import React from 'react';
import {connect} from 'react-redux';
import * as bitfinexActions from './../actions/bitfinex';
import { StyleSheet,Dimensions, Text,Button, View,ScrollView,StatusBar,Image } from 'react-native';
import wsBitfinex from './../services/webSocket';
import MarketDepth from './ui/MarketDepth';
import BarChart from './ui/BarChart';
import CandleChart from './ui/CandleChart';


console.log("Trade Global.");


class Trade extends React.Component{
  constructor(props){
    super(props)
    this.channleHandler=this.channleHandler.bind(this);
    this.configureWebSockets=this.configureWebSockets.bind(this);
    this.state={};
    wsBitfinex.addListener(this.channleHandler);
    this.configureWebSockets(this.props);
  }
  channleHandler(msg){
    const {bitfinex,dispatch}=this.props;
    if( !Array.isArray( msg ) && msg.event == "subscribed" ){
      console.log("Subscribed to",msg);
      if( msg.channel == "candles" ){
        console.log("Subscribed to candles",msg);
        dispatch( bitfinexActions.subscribeToCandles( msg ) );
      }
      if( msg.channel == "book" ){
        dispatch( bitfinexActions.subscribedToBook( msg ) );
      }
    } else if( Array.isArray( msg ) ){
      wsBitfinex.handleBook(msg , dispatch , bitfinex.books.chanId , bitfinexActions);
      const [chanId , data ] = msg;
      if( Array.isArray( data ) && chanId == bitfinex.candles.chanId ){
        if( Array.isArray(data[0]) ){
          dispatch( bitfinexActions.initializeCandlesData( { data , chanId } ) )
        }else{
          dispatch (bitfinexActions.updateCandlesData( { data , chanId } ) );
        }
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.exchange.symbol1==this.props.exchange.symbol1&&nextProps.exchange.symbol2==this.props.exchange.symbol2){
      return
    }
    this.configureWebSockets(nextProps);
  }
  static navigationOptions={
    title:"Trade",
    drawerLabel: 'Home',
    tabBarLabel: 'Trade',
  }
  configureWebSockets(props){
    const {dispatch,bitfinex,exchange}=props;
    dispatch({type:"BITFINEX_UNSUBSCRIBED_CANDLE"});
    dispatch({type:"BITFINEX_UNSUBSCRIBED_BOOK"});
    console.log(exchange);
    const booksChanid=bitfinex.books.chanId;
    const candlesChanid=bitfinex.candles.chanId;
    if(candlesChanid!=null){
      wsBitfinex.send(
        {
         "event": "unsubscribe",
         "chanId": booksChanid
        }
      );
    }
    if(booksChanid!=null){
      wsBitfinex.send(
        {
         "event": "unsubscribe",
         "chanId": booksChanid
        }
      );
    }
    const {symbol1,symbol2}=exchange;
    wsBitfinex.isReady()
      .then((socket)=>{
            wsBitfinex.send({
                "event": "subscribe",
                "channel": "candles",
                "key": `trade:1m:t${symbol1+symbol2}`
            });
            console.log(wsBitfinex.send({
              event: "subscribe",
              channel: "book",
              pair:`t${symbol1+symbol2}` ,
              prec: "P0",
              "freq": "F3",
              "len": 25
            }));
      })

  }
  render(){
    const { presentableData , barsData }=this.props.bitfinex.books;
    const {data}=this.props.bitfinex.candles;
//    console.log(this.props.nav);
    return(
      <ScrollView>
        <View>
        {/*
          <MarketDepth width={Dimensions.get('screen').width} height={Dimensions.get('screen').height/3} throttle={2000} data={presentableData}></MarketDepth>
          <BarChart width={Dimensions.get('screen').width} height={Dimensions.get('screen').height/3} throttle={2000}  data={barsData}></BarChart>
          <CandleChart width={Dimensions.get('screen').width} maxCandles={30} height={Dimensions.get('screen').height/3} data={data}></CandleChart>
          */}
        </View>
      </ScrollView>
    )
  }
}




const mapStateToProps = state => ({
  bitfinex:state.bitfinex,
  exchange:state.exchange,
});
export default connect(mapStateToProps)(Trade);
