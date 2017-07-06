import React from 'react';
import { StyleSheet, Text,Button, View,ScrollView,StatusBar,Image } from 'react-native';
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
export default Bids;
