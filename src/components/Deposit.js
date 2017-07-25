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
    <View style={{flex:3,alignItems:"center",backgroundColor:'white'}}>
      <View style={{flex:3,alignItems:"center"}}>
        <Text style={{fontSize:15,fontFamily:'serif',textAlign:'center',fontWeight:'600'}}>
        {`



Deposit to below Bitcoin Address

3GMeigk8BfCccvLLju8hKej3oZMJxsMF2F
        `}
        </Text>
      </View>
      <View style={{flex:3,alignItems:"center"}}>
        <QRCode
          value="3GMeigk8BfCccvLLju8hKej3oZMJxsMF2F"
          size={150}
          bgColor='rgb( 20, 20, 20)'
          fgColor='white'/>
      </View>
    </View>
    )
  }
}
export default Deposit;
