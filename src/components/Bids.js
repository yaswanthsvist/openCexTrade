import React from 'react';
import { StyleSheet, Text,Button, View,ScrollView,StatusBar,Image } from 'react-native';
import {connect} from 'react-redux';
import lodash from 'lodash';
class Bids extends React.Component{
  constructor(props){
    super(props)
    this.generateBooks=this.generateBooks.bind(this);
    this.state={};
  }
  static navigationOptions={
    title:"Bids",
    drawerLabel: 'Home',
    tabBarLabel: 'Bids',
  }
  componentWillReceiveProps( nextProps ){
    this.setState({
      bitfinex : nextProps.bitfinex,
      screen:nextProps.screen,
    });
  }
  generateBooks(){
//    console.log(this.state.data);
    if(this.state.data['asks']==undefined){
      return
    }

  }
  render(){
    const { presentableData ,barsData }=this.props.bitfinex.books;
    const {asks=[],bids=[]}= barsData;
    return(
      <View style={{flex:1,flexDirection:'row'}}>
        <View style={{flex:2}}>
          {
            asks.filter((item,i)=>(i<=25)).map((item,i)=>(
              <View style={{flex:1,flexDirection:'row'}} key={i+'asks'} >
                <View style={{flex:2,borderWidth:1}}><Text>{item[1]}</Text></View>
                <View style={{flex:3,backgroundColor:'rgba(0, 173, 239,0.3)',borderWidth:1}}><Text>{item[0]}</Text></View>
              </View>)
            )
          }
        </View>
        <View style={{flex:2}}>
          {
            bids.filter((item,i)=>(i<=25)).map((item,i)=>(
              <View style={{flex:1,flexDirection:'row'}} key={i+'bids'} >
                <View style={{flex:3,backgroundColor:'rgba(31, 212, 48,0.3)',borderWidth:1}}><Text>{item[0]}</Text></View>
                <View style={{flex:2,borderWidth:1}}><Text>{item[1]}</Text></View>
              </View>)
            )
          }
        </View>
      </View>
    )
  }
}
const mapStateToProps = state => ({
  bitfinex:state.bitfinex,
  screen:state.screen,
});

export default connect(mapStateToProps)(Bids);
