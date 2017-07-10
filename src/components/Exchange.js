import React from 'react';
import { StyleSheet, Text,Button,Dimensions, View,ScrollView,StatusBar,Image } from 'react-native';
import LineChart from './ui/LineChart';
import mockData from './../assets/mockData';
import * as exchangeActions from './../actions/exchange'
import {connect} from 'react-redux'
import DropDown from './ui/DropDown';

class Exchange extends React.Component{
  constructor(props){
    super(props)
    this.state={sampleRatio:1};
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
    const {dispatch}=this.props;
    const action=exchangeActions.setTimeType('data1h');
    dispatch(action);
  }
  showInMinuites(){
    const {dispatch,exchange}=this.props;
    const action=exchangeActions.setTimeType('data1m');
    dispatch(action);
    exchangeActions.fetchohlcv(exchange,dispatch);
  }
  showlast100days(){
    console.log("in days");
    const {dispatch}=this.props;
    const action=exchangeActions.setTimeType('data1d');
    dispatch(action);
  }
  static navigationOptions={
    title:"Exchange",
    drawerLabel: 'Home',
    tabBarLabel: 'Exchange',
  }
  render(){
    const tabBarHeight=60,statusBarHeight=20;
    const {timeType}=this.props.exchange;
    console.log(timeType);
    const scrollStyle={height:Dimensions.get('window').height-statusBarHeight-tabBarHeight-(50)}
    return(
      <View>
        <View style={{height:20,backgroundColor:'#000'}}>
        </View>
        <DropDown data={this.symbolPairs}></DropDown>
        <ScrollView>
          <View style={{height:500}}>
            <LineChart data={mockData.ohlcv} timeType={timeType} sampleRatio={this.state.sampleRatio} ></LineChart>
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
/* const function mapDispatchToProps(dispatch) {
   return bindActionCreators({reducer},dispatch)
 }
*/
export default connect(mapStateToProps)(Exchange);
