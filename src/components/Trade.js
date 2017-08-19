import React from 'react';
import {connect} from 'react-redux';
import * as bitfinexActions from './../actions/bitfinex';
import {TextInput, StyleSheet,Dimensions, Text,Button, View,ScrollView,StatusBar,Image } from 'react-native';
import wsBitfinex from './../services/webSocket';
import MarketDepth from './ui/MarketDepth';
import BarChart from './ui/BarChart';
import CandleChart from './ui/CandleChart';
import TouchableIcon from './ui/TouchableIcon';

import lodash from 'lodash';

const [CANDLE_CHART,MARKET_DEPTH,BAR_CHART]=[0,1,2];
const [BID, BID_SIZE, ASK, ASK_SIZE, DAILY_CHANGE, DAILY_CHANGE_PERC, LAST_PRICE, VOLUME, HIGH, LOW]=[0,1,2,3,4,5,6,7,8,9];
class Trade extends React.Component{
  constructor(props){
    super(props)
    this.channleHandler=this.channleHandler.bind(this);
    this.configureWebSockets=this.configureWebSockets.bind(this);
    this.onSelectGraph=this.onSelectGraph.bind(this);
    this.state={graph:CANDLE_CHART};

    this.configureWebSockets(this.props);
  }
  channleHandler(msg){
    const {bitfinex,dispatch,screen}=this.props;
    (!Array.isArray( msg ))?console.log(msg):null;
    if( !Array.isArray( msg ) && msg.event == "subscribed" ){
      console.log("Subscribed to",msg);
      if( msg.channel == "candles" ){
        console.log("Subscribed to candles",msg);
        dispatch( bitfinexActions.subscribeToCandles( msg ) );
      }
      if( msg.channel == "book" ){
        dispatch( bitfinexActions.subscribedToBook( msg ) );
      }
      if( msg.channel == "ticker" ){
        dispatch( bitfinexActions.subscribedToTicker( msg ) );
      }
    } else if( Array.isArray( msg ) ){
      wsBitfinex.handleBook(msg , dispatch , bitfinex.books.chanId , bitfinexActions);//handle bars and market depth charts
      const [chanId , data ] = msg;
      if( Array.isArray( data ) && chanId == bitfinex.candles.chanId ){
        if( Array.isArray(data[0]) ){  //array of candles(objects) is meant for initializing candle chart, if its object then add candle
          dispatch( bitfinexActions.initializeCandlesData( { data , chanId } ) )
        }else{
          dispatch (bitfinexActions.updateCandlesData( { data , chanId } ) );
        }
      }
      if( Array.isArray( data ) && chanId == bitfinex.ticker.chanId ){
          dispatch (bitfinexActions.updateTickerData( { data , chanId } ) );
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState){

    const {screen}=nextProps;
    if(screen=="Trade" || screen=="Bids"){
      return true;
    }
    return false;
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.exchange.symbol1==this.props.exchange.symbol1&&nextProps.exchange.symbol2==this.props.exchange.symbol2){
      return
    }
    this.configureWebSockets(nextProps);
  }
  onSelectGraph(graph){
    this.setState({graph});
  }
  static navigationOptions={
    title:"Trade",
    drawerLabel: 'Home',
    tabBarLabel: 'Trade',
  }
  configureWebSockets(props){
    const {dispatch,bitfinex,exchange}=props;
    dispatch({type:"BITFINEX_UNSUBSCRIBE_CANDLE"});
    dispatch({type:"BITFINEX_UNSUBSCRIBE_BOOK"});
    console.log(exchange);
    const booksChanid=bitfinex.books.chanId;
    const candlesChanid=bitfinex.candles.chanId;
    if(candlesChanid!=null){
      wsBitfinex.send({
         "event": "unsubscribe",
         "chanId": booksChanid
        });
    }
    if(booksChanid!=null){
      wsBitfinex.send({
         "event": "unsubscribe",
         "chanId": booksChanid
        });
    }
    wsBitfinex.listners=[];
    wsBitfinex.addListener(this.channleHandler);
    const {symbol1,symbol2}=exchange;
    wsBitfinex.isReady()
      .then((socket)=>{
            wsBitfinex.send({
                "event": "subscribe",
                "channel": "candles",
                "key": `trade:1m:t${symbol1+symbol2}`
            });
            wsBitfinex.send({
              event: "subscribe",
              channel: "book",
              pair:`t${symbol1+symbol2}` ,
              prec: "P0",
              "freq": "F3",
              "len": 25
            });
            wsBitfinex.send({
                "event": "subscribe",
                "channel": "ticker",
                "symbol": `t${symbol1+symbol2}`
            });
      })

  }
  render(){
    const { presentableData , barsData }=this.props.bitfinex.books;
    const {data}=this.props.bitfinex.candles;
    const tickerData=this.props.bitfinex.ticker.data;
    const { graph  }=this.state;
    let selectedGraph=null;
    switch (graph) {
      case MARKET_DEPTH:
        selectedGraph=(<MarketDepth width={Dimensions.get('screen').width} height={Dimensions.get('screen').height/3} throttle={10} data={presentableData}></MarketDepth>)
        break;
      case BAR_CHART:
        selectedGraph=(<BarChart width={Dimensions.get('screen').width} height={Dimensions.get('screen').height/3} throttle={10}  data={barsData}></BarChart>);
        break;
      case CANDLE_CHART:
      default:
        selectedGraph=(<CandleChart width={Dimensions.get('screen').width} maxCandles={30} height={Dimensions.get('screen').height/3} data={data}></CandleChart>);
    }
    return(
      <ScrollView>
        <View>
          <View>
            <Text>{`Last Price:${tickerData[LAST_PRICE]}\nDaily Change: ${tickerData[DAILY_CHANGE]}\n24h Volume: ${tickerData[VOLUME]}\nHigh: ${tickerData[HIGH]}\nLow: ${tickerData[LOW]}`}</Text>
          </View>
          {
            selectedGraph
          }
          <View style={{flexDirection:'row',marginTop:20,justifyContent:'space-around'}}>
            <TouchableIcon name={BAR_CHART} onPress={()=>this.onSelectGraph(BAR_CHART)} active={graph} source='bars' ></TouchableIcon>
            <TouchableIcon name={CANDLE_CHART} onPress={()=>this.onSelectGraph(CANDLE_CHART)} active={graph} source='candles' ></TouchableIcon>
            <TouchableIcon name={MARKET_DEPTH} onPress={()=>this.onSelectGraph(MARKET_DEPTH)} active={graph} source='market' ></TouchableIcon>
          </View>
          <View style={{flexDirection:'row',marginTop:10}}>
            <View style={{flexDirection:'column',marginTop:10}}>
              <View>
                <Text>{"USD to Spend"}</Text>
              </View>
              <View>
                <TextInput placeholder='Price'></TextInput>
                <TextInput placeholder='USD'></TextInput>
              </View>
              <View>
                <Button
                  onPress={() => {}}
                  title="BUY/BID"
                />
              </View>
            </View>
            <View style={{flexDirection:'column',marginTop:10}}>
              <View>
                <Text>{"BTC to Sell"}</Text>
              </View>
              <View>
                <TextInput placeholder='Price'></TextInput>
                <TextInput placeholder='BTC'></TextInput>
              </View>
              <View>
                <Button
                  onPress={() => {}}
                  title="SELL/ASK"
                />
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    )
  }
}




const mapStateToProps = state => ({
  bitfinex:state.bitfinex,
  exchange:state.exchange,
  screen:state.screen,
});
export default connect(mapStateToProps)(Trade);
