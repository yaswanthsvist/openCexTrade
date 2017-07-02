import React from 'react';
import { StyleSheet, Text, View,ScrollView,StatusBar,Image } from 'react-native';
import {addNavigationHelpers,TabNavigator,DrawerNavigator,StackNavigator,DrawerItems} from 'react-navigation';

const DrawerComponent=(props)=>(
  <View style={{flex:1}}>
    <View style={{flex:3,paddingBottom:20,paddingTop:20,backgroundColor:"#095974",justifyContent:'center'}}>
      <Image source={require('./src/assets/img/cex.png')} style={{height:80,resizeMode:"contain",marginLeft:'auto',marginRight:'auto',}} />
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
    drawerLabel: 'Exchange',
    tabBarLabel: 'Trade',
  }
  render(){
    return(
      <View>
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
    drawerLabel: 'Exchange',
    tabBarLabel: 'Bids',
  }
  render(){
    return(
      <View>
        <Text>Bids here</Text>
      </View>
    )
  }
}

class Exchange extends React.Component{
  constructor(props){
    super(props)
    this.state={};
  }
  static navigationOptions={
    title:"Exchange",
    drawerLabel: 'Exchange',
    tabBarLabel: 'Exchange',
  }
  render(){
    return(
      <View>
        <Text>Exchange here</Text>
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
  }
},{
  contentComponent:DrawerComponent,
  drawerWidth:240
})


export default class App extends React.Component {
  render() {
    return (
      <DrawerApp></DrawerApp>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
