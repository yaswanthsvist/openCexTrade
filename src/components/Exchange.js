import React from 'react';
import { StyleSheet, Text,Button,Dimensions, View,ScrollView,StatusBar,Image } from 'react-native';
import LineChart from './ui/LineChart';
import mockData from './../assets/mockData';
import * as exchangeActions from './../actions/exchange'
import * as public_dataActions from './../actions/public_data'
import {connect} from 'react-redux'
import DropDown from './ui/DropDown';
import TouchableIcon from './ui/TouchableIcon';
import CandleChart from './ui/CandleChart';
import wsBitfinex from './../services/webSocket';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

class Exchange extends React.Component{
  constructor(props){
    console.log("Exchange");
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
  componentDidMount() {
    const {dispatch}=this.props;
    dispatch(public_dataActions.fetchOhlcv());
  }
  componentWillReceiveProps(nextProps){
      if(nextProps.exchange.symbol1==this.props.exchange.symbol1&&nextProps.exchange.symbol2==this.props.exchange.symbol2){
        return
      }
      const {dispatch}=this.props;
      dispatch(public_dataActions.fetchOhlcv());
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
    const ohlcv=this.props.ohlcv;
    //console.log(timeType);
    const scrollStyle={height:Dimensions.get('window').height-statusBarHeight-tabBarHeight-(50)}
    return(
      <View>
        <DropDown data={this.symbolPairs}></DropDown>
        <ScrollView>
          <View style={{flex:1}}>
          <LineChart data={ohlcv} timeType={timeType}  width={Dimensions.get('screen').width} height={Dimensions.get('screen').height*2/5}  sampleRatio={1} ></LineChart>
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
            <MultiSlider
              selectedStyle={{
                backgroundColor: 'gold',
              }}
              unselectedStyle={{
                backgroundColor: 'silver',
              }}
              values={[5,10]}
              containerStyle={{
                height:200,
                marginTop:30,
                marginBottom:20,
              }}
              container={{
                height:80,
              }}
              enabledTwo={true}
              markerContainer={{
                height:80,
              }}
              markerStyle={{
                height:30,
                marginTop:10,
                width:30,
                borderRadius:30,
              }}
              pressedMarkerStyle={{
                height:38,
                width:38,
                borderRadius:40,
              }}
              trackStyle={{
                height:10,
                backgroundColor: 'red',
              }}
              min={0}
              max={20}
              touchDimensions={{
                height: 80,
                width: 80,
                borderRadius: 20,
                slipDisplacement: 40,
              }}
              sliderLength={Dimensions.get('screen').width}
            />
          </View>

        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  exchange: state.exchange,
  bitfinex:state.bitfinex,
  ohlcv:state.public_data.ohlcv,
});
/* const function mapDispatchToProps(dispatch) {
   return bindActionCreators({reducer},dispatch)
 }
*/
export default connect(mapStateToProps)(Exchange);
