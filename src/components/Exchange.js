
import React from 'react';
import { StyleSheet, Text,Button, View,ScrollView,StatusBar,Image } from 'react-native';
import { TouchableHighlight, TouchableWithoutFeedback,List,ListItem,Animated,Easing,Dimensions,FlatList} from 'react-native';
import LineChart from './../components/LineChart';
import mockData from './../assets/mockData'
import {connect} from 'react-redux'

/*
@Do not use DropDown Component inside a ScrollView since DropDown is using a ScrollView internally.
*/
class DropDown extends React.Component{
  constructor(props){
    super(props)
    this.state={
      selected:this.props.selected||this.props.data[0].key,
      data:this.props.data,
    }
    this.dropHeight=this.props.dropHeight||250;
    this.toggleDropDownView=this.toggleDropDownView.bind(this);
    this.selectedItem=this.selectedItem.bind(this);
  }
  componentWillMount() {
    this.animatedValue=new Animated.Value(0);
  }
  toggleDropDownView(){
    let options={
      toValue:0,
      duration:800,
    }
    if(JSON.stringify(this.animatedValue)==='0'){
      options={...options,toValue:this.dropHeight}
    }
    console.log(options);
    Animated.timing(this.animatedValue,options).start()
  }
  selectedItem(key){
      this.setState({'selected':key},this.toggleDropDownView);
  }
  render(){
    const AnimatedStyle={height:this.animatedValue};
    return(
      <View>
        <View style={{height:50,backgroundColor:'#eee'}}>
          <TouchableWithoutFeedback onPress={this.toggleDropDownView}>
            <View>
              <Text style={{height:50,textAlignVertical:'center',textAlign:'center'}}>{this.state.selected}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Animated.View style={[{backgroundColor:'#fff'},AnimatedStyle]}>
          <ScrollView>
          {  <FlatList data={this.state.data}
            renderItem={({item})=>(
              <TouchableHighlight onPress={()=>this.selectedItem(item.key)}>
                <View style={{backgroundColor:'#ccc'}}>
                  <Text style={{textAlign:'center'}}>{`${item.key}`}</Text>
                </View>
              </TouchableHighlight>
              )
            }
            />}
          </ScrollView>
        </Animated.View>
      </View>
    )
  }
}


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
      {key:'TH:USD'},
      {key:'EH:USD'},
      {key:'ET:USD'},
      {key:'ETH:USD'},
      {key:'1EH:USD'},
      {key:'1ET:USD'},
      {key:'1ETH:USD'},
      {key:'BTC:ETH'},
      {key:'BTC:ET'},
      {key:'BTC:EH'},
      {key:'BTC:TH'},
      {key:'BTC:EUR'},
      {key:'BTC:UR'},
      {key:'BTC:EU'},
      {key:'BTC:ER'},
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
