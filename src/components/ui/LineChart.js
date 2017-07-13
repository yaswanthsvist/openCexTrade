import React from 'react';
import { StyleSheet,Dimensions, Text, View,ScrollView,StatusBar,Image } from 'react-native';
import {ART} from "react-native";
import * as scale from "d3-scale";
import * as shape from "d3-shape";
import * as d3Array from "d3-array";
const d3 = {scale,shape};
const {Shape,Surface,Group} =  ART;

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

const generateAxisData=(data,lines=5) => {

  const values = data.map( item => item.value );
  const timeLine = data.map( item => item.time );

  const hmin = Math.min( ...values );//height min
  const hmax = Math.max( ...values );//height max
  const gapBtwHLines = ( hmax - hmin )/ lines; //gap between horizontal Lines
  const tmin = Math.min( ...timeLine );
  const tmax = Math.max( ...timeLine );
  const gapBtwVLines = ( tmax - tmin )/ lines; //time gap between Vertical Lines

  let linesHData=[];
  let linesVData=[];
  for(let i = 0 ; i < lines ; i++ ){
    const hValue = hmin + gapBtwHLines*i ;
    const tValue = tmin + gapBtwVLines*i ;
    linesHData.push( [
                { time : tmin , value : hValue },
                { time : tmax , value : hValue },
                { time : tmax , value : hValue*0.9999 }
              ] );//height will be constant
    linesVData.push( [
                { time : tValue , value : hmin },
                { time : tValue , value : hmax },
                { time : tValue , value : hmax*0.9999 }
              ] );//time will be constant
  }
  return { linesVData , linesHData };
}
/**
 * Create d attribute for an SVG path or ART's Shape.
 * @param {array} lineData consists array of {timestamp,value}.
 * @param {number} height height of shape defaults to device Width.
 * @param {number} width width of shape defaults to device Width.
 * @param {number} scale to scale y axis points.
 */


class LineChart extends React.Component{
  constructor( props ){
    super( props )
    this.width = Dimensions.get('window').width-60;
    if( this.props.data == null ){
      this.state = {
        data : null ,
        sampleRatio : this.props.sampleRatio,
      };
      return;
    }
    this.state={
      data : this.props.data[ this.props.timeType ],
      sampleRatio : this.props.sampleRatio ,
    };
    this.getlines = this.getlines.bind( this );
    this.getPath = this.getPath.bind( this );
  }
  getPath(
    lineData,
    scale = 1
   ){
     const height = this.width;
     const width = this.width;
     const lastDatum = lineData[ lineData.length - 1 ];
     const allYValues = lineData.reduce( ( all , datum ) => {
        all.push( parseInt( datum.value ) );
        return all;
      }, [] );
      const scaleX = createScaleX( lineData[0].time , lastDatum.time , width)
      const extentY = d3Array.extent( allYValues );
      const scaleY = createScaleY( extentY[0] , extentY[1] , width );
      return d3.shape.line()
              .x( d => scaleX( d.time ) )
              .y( d => ( scaleY( d.value * scale ) ) );
  }
  getlines(){
    if( this.state.data == null ){
      return
    }
    let highData = this.state.data
      .filter( ( candle , index ) => { return ( !( index%this.state.sampleRatio ) ) } )//sampling data here
      .map( candle => {
        return { time : new Date( candle[0] ) , value : candle[2] }
      });
    let lowData = this.state.data
      .filter( ( candle , index ) => { return ( !( index%this.state.sampleRatio ) ) })//sampling data here
      .map( candle => ( { time : new Date( candle[0] ) , value : candle[3] } ) );
    let volumeData = this.state.data
      .filter( (candle,index) => { return ( !( index%this.state.sampleRatio ) ) } )//sampling data here
      .map( candle => ( { time : new Date( candle[0] ) , value : candle[5] } ) );// 5 is for volume

    const axisData = generateAxisData(highData);
    this.hLines=axisData.linesHData.map(data=>this.getPath(data)(data));
    this.vLines=axisData.linesVData.map(data=>(this.getPath(data)(data)));
    const high = this.getPath( highData )
    this.high = high( highData );
    const low = this.getPath( lowData )
    this.low = low( lowData );
    const volume = this.getPath( volumeData , 0.3 )
    this.volume = `M0 ${ this.width } ` + volume( volumeData ).slice( 1 ) + `L${ this.width } ${ this.width } Z`;
  }
  componentWillReceiveProps( nextProps ){
    if( nextProps.data == null || Array.isArray(nextProps.data) ){
      this.setState({
        data : null
      })
      return
    }
    this.setState({
      data : JSON.parse( nextProps.data[ nextProps.timeType ] )
    })
  }
  render(){
    this.getlines();
    if( this.state.data == null ){
      return (<View style = { styles.chartMsgView } ><Text style = {styles.chartMsg} >Unable to get the Data</Text></View>);
    }
    return(
      <View style = {styles.chartView}>
        <Surface width = {this.width} height = {this.width}>
          <Group x = {0} y = {0}>
            <Shape
              d = 'M0,300L300,300L277.3109243697479,214.3843714285714'
              fill = '#000'
              strokeWidth = {1}
              >
            </Shape>
            <Shape
              d  =  {this.high}
              stroke = '#1faa00'
              strokeWidth = {1}
              >
            </Shape>
            <Shape
              d = {this.low}
              stroke = '#c300'
              strokeWidth = {1}
              >
            </Shape>
            <Shape
              d = {this.volume}
              fill = 'rgba(0,0,255,0.31)'
              strokeWidth = {1}
              >
            </Shape>

            {
              this.hLines.map((d,i)=>(
                <Shape
                  d = {d}
                  key={i+'h'}
                  fill = '#000'
                  strokeWidth = {1}
                  >
                </Shape>
              ))
            }
            {
              this.vLines.map((d,i)=>(
                <Shape
                  d = {d}
                  key={i+'v'}
                  fill = '#aaa'
                  strokeWidth = {1}
                  >
                </Shape>
              ))
            }
          </Group>
        </Surface>
      </View>
    )
  }
}
export default LineChart;

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  chartMsgView : {
    flexDirection : "row",
    alignItems : 'center',
    backgroundColor : '#448aff',
    width : windowWidth,
    height : windowWidth,
  },
  chartView : {
    backgroundColor : '#c0cfff',
    width : windowWidth,
    height : windowWidth,
  },
  chartMsg : {
    width : windowWidth,
    color : '#eee',
    textAlign : 'center',
    fontSize : 18,
    fontWeight : 'bold',
  },
})
