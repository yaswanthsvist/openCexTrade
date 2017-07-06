import React from 'react';
import { StyleSheet, Text,Button, View,ScrollView,StatusBar,Image } from 'react-native';
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
export default Authenticate;
