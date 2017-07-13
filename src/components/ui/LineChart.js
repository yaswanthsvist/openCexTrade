import React from 'react';
import { StyleSheet,Dimensions, Text, View,ScrollView,StatusBar,Image } from 'react-native';
import {ART} from "react-native";
import * as scale from "d3-scale";
import * as shape from "d3-shape";
import * as d3Array from "d3-array";
const d3={scale,shape};
const {Shape,Surface,Group}= ART;

/**
 * Create an x-scale.
 * @param {number} start Start time in seconds.
 * @param {number} end End time in seconds.
 * @param {number} width Width to create the scale with.
 * @return {Function} D3 scale instance.
 */
function createScaleX(start, end, width) {
  return d3.scale.scaleTime()
    .domain([new Date(start), new Date(end)])
    .range([0, width]);
}

/**
 * Create a y-scale.
 * @param {number} minY Minimum y value to use in our domain.
 * @param {number} maxY Maximum y value to use in our domain.
 * @param {number} height Height for our scale's range.
 * @return {Function} D3 scale instance.
 */
function createScaleY(minY, maxY, height) {
  return d3.scale.scaleLinear()
    .domain([minY, maxY]).nice()
    // We invert our range so it outputs using the axis that React uses.
    .range([height, 0]);

}
/**
 * Create d attribute for an SVG path or ART's Shape.
 * @param {array} lineData consists array of {timestamp,value}.
 * @param {number} height height of shape defaults to device Width.
 * @param {number} width width of shape defaults to device Width.
 * @param {number} scale to scale y axis points.
 */
const getPath=(
  lineData,
  height=Dimensions.get('window').width,
  width=Dimensions.get('window').width,
  scale=1
 )=>{
  const lastDatum = lineData[lineData.length - 1];
  const allYValues = lineData.reduce((all, datum) => {
      all.push(parseInt(datum.value));
      return all;
    }, []);
  const scaleX=createScaleX(lineData[0].time,lastDatum.time,width)
  const extentY = d3Array.extent(allYValues);
  const scaleY = createScaleY(extentY[0], extentY[1],width);
  return d3.shape.line().x(d=>scaleX(d.time)).y(d=>(scaleY(d.value*scale))).curve(d3.shape.curveCatmullRom);
}


class LineChart extends React.Component{
  constructor(props){
    super(props)
    if(this.props.data==null){
      this.state={
        data:null,
        sampleRatio:this.props.sampleRatio,
      };
      return;
    }
    this.state={
      data:this.props.data[this.props.timeType],
      sampleRatio:this.props.sampleRatio,
    };
    this.getlines=this.getlines.bind(this);
  }
  getlines(){
    this.width=Dimensions.get('window').width;
    if(
      this.state.data==null
    ){
      return
    }
    let highData=this.state.data
      .filter((candle,index)=>{return (!(index%this.state.sampleRatio))})//sampling data here
      .map((candle)=>{
        return {time:new Date(candle[0]),value:candle[2]}
      });
    let lowData=this.state.data
      .filter((candle,index)=>{return (!(index%this.state.sampleRatio))})//sampling data here
      .map(candle=>({time:new Date(candle[0]),value:candle[3]}));
    let volumeData=this.state.data
      .filter((candle,index)=>{return (!(index%this.state.sampleRatio))})//sampling data here
      .map(candle=>({time:new Date(candle[0]),value:candle[5]}));// 5 is for volume

    const high=getPath(highData)
    this.high=high(highData);
    const low=getPath(lowData)
    this.low=low(lowData);
    const volume=getPath(volumeData,undefined,undefined,0.3)
    this.volume=`M0 ${this.width} `+volume(volumeData).slice(1)+`L${this.width} ${this.width} Z`;
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.data==null || Array.isArray(nextProps.data)){
      this.setState({
        data:null
      })
      return
    }
    this.setState({
      data:JSON.parse(nextProps.data[nextProps.timeType])
    })
  }
  render(){
    this.getlines();
    if(this.state.data==null){
      return (<View style={styles.chartMsgView}><Text style={styles.chartMsg}>Unable to get the Data</Text></View>);
    }
    return(
      <View style={styles.chartView}>
        <Surface width={this.width} height={this.width}>
          <Group x={0} y={0}>
            <Shape
              d={this.high}
              stroke='#1faa00'
              strokeWidth={1}
              >
            </Shape>
            <Shape
              d={this.low}
              stroke='#c300'
              strokeWidth={1}
              >
            </Shape>
            <Shape
              d={this.volume}
              fill='rgba(0,0,255,0.31)'
              strokeWidth={1}
              >
            </Shape>
          </Group>
        </Surface>
      </View>
    )
  }
}
export default LineChart;

const windowWidth=Dimensions.get('window').width;
const styles=StyleSheet.create({
  chartMsgView:{
    flexDirection:"row",
    alignItems:'center',
    backgroundColor:'#448aff',
    width:windowWidth,
    height:windowWidth,
  },
  chartView:{
    backgroundColor:'#c0cfff',
  },
  chartMsg:{
    width:windowWidth,
    color:'#eee',
    textAlign:'center',
    fontSize:18,
    fontWeight:'bold',
  },
})
