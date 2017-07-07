import React from 'react';
import { StyleSheet, Text, View,ScrollView,StatusBar,Image } from 'react-native';
import Svg,{Path,G} from 'react-native-svg';
import {ART} from "react-native";
import d3 from "d3";
const {Shape,Surface,Group}= ART;
class MarketDepth extends React.Component{
  constructor(props){
    super(props)
    this.state={};
  }
  render(){
    return(
      <Svg
          height="300"
          width="300"
      >
        <G>
        <Path
            d="M150 150 L98 65 L70 25 L16 77 L11 30 L0 4 L90 50 L50 10 L11 22 L77 95 L20 25"
            fill="none"
            stroke="red"
          />
          <Path
              d="M0 150 L90 45 L50 5 L56 77 L11 30 L0 4 L90 50 L50 10 L11 22 L77 95 L80 35"
              fill="none"
              stroke="red"
            />
        </G>
      </Svg>
    )
  }
}
export default MarketDepth;
