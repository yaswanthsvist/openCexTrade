import React from 'react';
import {connect} from 'react-redux';
import { StyleSheet, Text,Button, View,ScrollView,StatusBar,Image } from 'react-native';
import { TouchableHighlight, TouchableWithoutFeedback,List,ListItem,Animated,Easing,FlatList} from 'react-native';
import Triangle from 'react-native-triangle';
import * as exchangeActions from './../../actions/exchange'
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
    this.dropHeight=this.props.dropHeight||100;
    this.actionToDispatchAfterAnimation=undefined;
    this.toggleDropDownView=this.toggleDropDownView.bind(this);
    this.selectedItem=this.selectedItem.bind(this);
  }
  componentWillMount() {
    this.animatedValue=new Animated.Value(0);
    this.animatedAngle=new Animated.Value(0);
  }
  toggleDropDownView(){
    let options={
      toValue:0,
      duration:800,
    }
    let optionsAngle={
      toValue:0,
      duration:800,
    }
    if(JSON.stringify(this.animatedValue)==='0'){
      options={...options,toValue:this.dropHeight}
      optionsAngle={...optionsAngle,toValue:1}
    }
    const {dispatch} =this.props;
    Animated.parallel([
      Animated.timing(this.animatedValue,options),
      Animated.timing(this.animatedAngle,optionsAngle)
    ]).start(()=>{
      if(this.actionToDispatchAfterAnimation!=undefined){
        dispatch(this.actionToDispatchAfterAnimation)
        this.actionToDispatchAfterAnimation=undefined;
      }
    })
  }
  selectedItem(key){
    const keys=key.split(':');
    this.actionToDispatchAfterAnimation=exchangeActions.setSymbols(keys[0],keys[1]);
    this.setState({'selected':key},this.toggleDropDownView);
  }
  render(){
    const AnimatedStyle={height:this.animatedValue};
    const interpolateRotation=this.animatedAngle.interpolate({
      inputRange:[0,1],
      outputRange:['0deg','-180deg'],
    })
    const dropDownArrowAngle={transform:[{rotate:interpolateRotation}]};
    return(
      <View>
        <View style={{height:50,backgroundColor:'#eee'}}>
          <TouchableWithoutFeedback onPress={this.toggleDropDownView}>
            <View style={{height:50,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <View style={{width:'auto'}}>
                <Text style={{width:'auto',height:'auto',textAlign:'center'}}>{this.state.selected}
                </Text>
              </View>
              <Animated.View style={dropDownArrowAngle}>
                <Triangle
                  style={{margin:10}}
                  width={10}
                  height={10}
                  color={'blue'}
                  direction={'down'}
                />
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Animated.View style={[{backgroundColor:'#eee'},AnimatedStyle]}>
          <ScrollView>
          {  <FlatList data={this.state.data}
            renderItem={({item})=>(
              <TouchableHighlight onPress={()=>this.selectedItem(item.key)}>
                <View style={styles.keyView}>
                  <Text style={styles.keyText}>{`${item.key}`}</Text>
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
const mapStateToProps = state => ({
  exchange: state.exchange
});
export default connect()(DropDown);
const styles=StyleSheet.create({
  keyText:{
    fontSize:15,
    textAlign:'center'
  },
  keyView:{
    backgroundColor:'#ccc',
    padding:4,
    borderBottomWidth:1,
    borderBottomColor:'#333',
  }
})
