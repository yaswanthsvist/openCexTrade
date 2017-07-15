import React from 'react';
import {connect} from 'react-redux';
import * as bitfinexActions from './../actions/bitfinex';
import { StyleSheet, Text,Button, View,ScrollView,StatusBar,Image } from 'react-native';
import wsBitfinex from './../services/webSocket';
class Trade extends React.Component{
  constructor(props){
    super(props)
    const candleChannleHandler=(evt)=>{
      const msg=JSON.parse(evt.data);
      const {bitfinex,dispatch}=this.props;
      if( !Array.isArray( msg ) && msg.event == "subscribed" ){
        if( msg.channel == "candles" ){
          dispatch( bitfinexActions.subscribeToCandles( msg ) );
        }
      } else if( Array.isArray( msg ) ){
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
    wsBitfinex.init().then(()=>wsBitfinex.send({
            "event": "subscribe",
            "channel": "candles",
            "key": "trade:1m:tBTCUSD"
          }));
  }
  componentWillReceiveProps(nextProps) {
    const {data}=this.props.bitfinex.candles;
    if(
      nextProps.bitfinex.candles.data!=null &&
      data != null &&
      data.length != nextProps.bitfinex.candles.data.length
    ){
      console.log(nextProps.bitfinex.candles.data[0]);
    }
  }
  static navigationOptions={
    title:"Trade",
    drawerLabel: 'Home',
    tabBarLabel: 'Trade',
  }
  render(){
    return(
      <View>
        {/*<MarketDepth></MarketDepth>*/}
        <Text>Trade here</Text>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  bitfinex:state.bitfinex,
});
export default connect(mapStateToProps)(Trade);
