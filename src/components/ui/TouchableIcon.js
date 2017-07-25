import React from 'react';
import { TouchableHighlight , StyleSheet, Text , View , Image } from 'react-native';
import {icons} from './../../styles'
import lodash from 'lodash';
export default class TouchableIcon extends React.Component{
  constructor(props){
    super(props)
    this.state={};
    this.prioritizeRecievedPropsOverDefault()
  }

  prioritizeRecievedPropsOverDefault(){
    this.styles = {...this.props.styles}||{} ;
    this.styles.view={...styles.view,...this.styles.view};
    this.styles.icon={...styles.icon,...this.styles.icon};
  }

  render(){
    const {name,active='',title}=this.props;
    const icon=icons[this.props.source];
    let Title=null;
    if(title!=undefined){
      Title=(<Text>{title}</Text>);
    }
    if(active==name){
      this.styles.icon.tintColor="#1fd430";
    }else{
      delete this.styles.icon.tintColor;
    }
    return(
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={this.styles.view}>
          <Image
            style={this.styles.icon}
            source={icon}
            />
          {Title}
        </View>
      </TouchableHighlight>
    )
  }
}
const styles={
  view : {
    alignSelf:'stretch',
    width:50,
    height:50,
  },
  icon : {
    resizeMode:'contain',
    width:50,
    height:50,
    backfaceVisibility:'hidden',
    backgroundColor:"transparent",
  },
};
