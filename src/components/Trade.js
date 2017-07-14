import React from 'react';
import { StyleSheet, Text,Button, View,ScrollView,StatusBar,Image } from 'react-native';
import wsBitfinex from './../services/webSocket';
class Trade extends React.Component{
  constructor(props){
    super(props)
    this.state={};
    wsBitfinex.init();
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
export default Trade;
