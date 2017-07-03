import React from 'react';
import { StyleSheet, Text, View,ScrollView,StatusBar,Image } from 'react-native';
import QRCode from 'react-native-qrcode';

class Deposit extends React.Component{
  constructor(props){
    super(props)
    this.state={};
  }
  static navigationOptions={
    title:"Deposit",
    drawerLabel: 'Deposit',
    tabBarLabel: 'Deposit',
  }
  render(){
    return(
    <View style={{flex:3,alignItems:"center"}}>
      <View style={{flex:3,alignItems:"center"}}>
        <Text>
        {`



          Deposit to below Bitcoin Address

          3GMeigk8BfCccvLLju8hKej3oZMJxsMF2F

          https://coinmarketcap.com/

        `}
        </Text>
      </View>
      <View style={{flex:3,alignItems:"center"}}>
        <QRCode
          value="3GMeigk8BfCccvLLju8hKej3oZMJxsMF2F"
          size={150}
          bgColor='purple'
          fgColor='white'/>
      </View>
    </View>
    )
  }
}
export default Deposit;
