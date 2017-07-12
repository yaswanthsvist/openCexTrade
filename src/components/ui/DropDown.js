import React from 'react';
import { StyleSheet, Text,Button, View,ScrollView,StatusBar,Image } from 'react-native';
import { TouchableHighlight, TouchableWithoutFeedback,List,ListItem,Animated,Easing,FlatList} from 'react-native';
import Triangle from 'react-native-triangle';
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
      Animated.parallel([
        Animated.timing(this.animatedValue,options),
        Animated.timing(this.animatedAngle,optionsAngle)
      ]).start()
  }
  selectedItem(key){
      this.setState({'selected':key},this.toggleDropDownView);
      const {dispatch} =this.props;
      const keys=key.split(':');
      const action=exchangeActions.setSymbols(keys[0],keys[1]);
      dispatch(action);
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

export default DropDown;
