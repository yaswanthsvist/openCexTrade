
import React from 'react';
import { StyleSheet, Text,Button,Dimensions, View,ScrollView,StatusBar,Image } from 'react-native';
import LineChart from './ui/LineChart';
import mockData from './../assets/mockData'
import {connect} from 'react-redux'
import DropDown from './ui/DropDown';

class Exchange extends React.Component{
  constructor(props){
    super(props)
    console.log(this.props);
    this.state={timeType:'data1h',sampleRatio:1};
    this.showHourly=this.showHourly.bind(this);
    this.showInMinuites=this.showInMinuites.bind(this);
    this.showlast100days=this.showlast100days.bind(this);
    this.symbolPairs=[
      {key:'BTC:USD'},
      {key:'BTC:ETH'},
      {key:'ETH:USD'},
    ];
  }
  showHourly(){
    console.log("in hourly");
    this.setState(()=>({"timeType":"data1h",sampleRatio:1}));
  }
  showInMinuites(){
    console.log("in minute");
    this.setState({timeType:'data1m',sampleRatio:1})
  }
  showlast100days(){
    console.log("in minute");
    this.setState({timeType:'data1d',sampleRatio:1})
  }
  static navigationOptions={
    title:"Exchange",
    drawerLabel: 'Home',
    tabBarLabel: 'Exchange',
  }
  render(){
    const tabBarHeight=60,statusBarHeight=20;
    const scrollStyle={height:Dimensions.get('window').height-statusBarHeight-tabBarHeight-(50)}
    return(
      <View>
        <View style={{height:20,backgroundColor:'#000'}}>
        </View>
        <DropDown data={this.symbolPairs}></DropDown>
        <ScrollView>
          <View style={{height:500}}>
            <LineChart data={mockData.ohlcv} timeType={this.state.timeType} sampleRatio={this.state.sampleRatio} ></LineChart>
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
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  exchange: state.exchange,
});


export default connect(mapStateToProps)(Exchange);
