import React from 'react';
import { StyleSheet, Text,Button, View,ScrollView,StatusBar,Image } from 'react-native';
import {addNavigationHelpers,TabNavigator,DrawerNavigator,StackNavigator,DrawerItems} from 'react-navigation';
import Deposit from './../components/Deposit';
import MarketDepth from './../components/MarketDepth';
import LineChart from './../components/LineChart';

import mockData from './../assets/mockData'

const DrawerComponent=(props)=>(
  <View style={{flex:1}}>
    <View style={{flex:3,paddingBottom:20,paddingTop:20,backgroundColor:"#095974",justifyContent:'center'}}>
      <Image source={require('../assets/img/cex.png')} style={{height:80,resizeMode:"contain",marginLeft:'auto',marginRight:'auto',}} />
    </View>
    <View style={{flex:7}}>
      <DrawerItems {...props}/>
    </View>
  </View>
)

class Authenticate extends React.Component{
  constructor(props){
    super(props)
    this.state={};
  }
  static navigationOptions={
    title:"Authenticate",
    drawerLabel: 'Authenticate',
    tabBarLabel: 'Authenticate',
  }
  render(){
    return(
      <View style={{flex:1}}>
        <Text>Authenticate here</Text>
      </View>
    )
  }
}

class Trade extends React.Component{
  constructor(props){
    super(props)
    this.state={};
  }
  static navigationOptions={
    title:"Trade",
    drawerLabel: 'Home',
    tabBarLabel: 'Trade',
  }
  render(){
    return(
      <View>
        <MarketDepth></MarketDepth>
        <Text>Trade here</Text>
      </View>
    )
  }
}
class Bids extends React.Component{
  constructor(props){
    super(props)
    this.state={};
  }
  static navigationOptions={
    title:"Bids",
    drawerLabel: 'Home',
    tabBarLabel: 'Bids',
  }
  render(){
    return(
      <View>
      </View>
    )
  }
}

class Exchange extends React.Component{
  constructor(props){
    super(props)
    this.state={timeType:'data1h'};
    this.showHourly=this.showHourly.bind(this);
    this.showInMinuites=this.showInMinuites.bind(this);
    this.showlast100days=this.showlast100days.bind(this);
  }
  showHourly(){
    console.log("in hourly");
    this.setState(()=>({"timeType":"data1h"}));
  }
  showInMinuites(){
    console.log("in minute");
    this.setState({timeType:'data1m'})
  }
  showlast100days(){
    console.log("in minute");
    this.setState({timeType:'data1d'})
  }
  static navigationOptions={
    title:"Exchange",
    drawerLabel: 'Home',
    tabBarLabel: 'Exchange',
  }
  render(){
    console.log(this.state.timeType);
    return(
      <View>
        <LineChart data={mockData.ohlcv} timeType={this.state.timeType} ></LineChart>
        <Button
          onPress={this.showInMinuites}
          title="Minute"
          color="#841584"
          >
          </Button>
        <Button
          onPress={this.showHourly}
          title="Hours"
          color="#841584"
          >
          </Button>
        <Button
          onPress={this.showlast100days}
          title="Days"
          color="#841584"
          >
        </Button>
      </View>
    )
  }
}

const tabConfig={
  Exchange:{
    screen:Exchange,
    },

  Trade:{
    screen:Trade,
    },

  Bids:{
    screen:Bids
    },
};
const ExchangeTab=TabNavigator(tabConfig,{
  initialRouteName:"Exchange",
  tabBarPosition:"bottom"
})
const TradeTab=TabNavigator(tabConfig,{
  initialRouteName:"Trade",
  tabBarPosition:"bottom"
})
const BidsTab=TabNavigator(tabConfig,{
  initialRouteName:"Bids",
  tabBarPosition:"bottom"
})
const DrawerApp=DrawerNavigator({
    Exchange:{
      screen:ExchangeTab,
    },
    Authenticate:{
      screen:Authenticate,
    },
    Deposit:{
      screen:Deposit,
    }
  },{
    contentComponent:DrawerComponent,
    drawerWidth:240
  }
)

export default DrawerApp;
