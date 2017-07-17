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
    .domain([start, end])
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

const generateAxis = ( width , height , lines = 5 ) => {
  const gapBtwHLines = ( height )/ lines; //gap between horizontal Lines
  const gapBtwVLines = ( width )/ lines; //time gap between Vertical Lines
  let linesData=[];
  let hValues=[];
  let wValues=[];
  for(let i = 0 ; i < lines ; i++ ){
    const hValue =gapBtwHLines*i ;
    const wValue =gapBtwVLines*i ;
    hValues.push(hValue);
    wValues.push(wValue);
    linesData.push(`M0,${hValue}L${width},${hValue}`);//height will be constant
    linesData.push(`M${wValue},0L${wValue},${height}`);//height will be constant
  }
  return {linesData,hValues,wValues};
}
/**
 * Create d attribute for an SVG path or ART's Shape.
 * @param {array} lineData consists array of {timestamp,value}.
 * @param {number} height height of shape defaults to device Width.
 * @param {number} width width of shape defaults to device Width.
 * @param {number} scale to scale y axis points.
 */

class MarketDepth extends React.Component{
  constructor( props ){
    super( props )
    this.width = Dimensions.get('window').width-60;
    const {linesData,hValues,wValues}=generateAxis(this.width,this.width,6);
    this.axis = linesData;
    this.baseTicks=wValues;
    this.vertiaclTicks=hValues;
    this.getlines = this.getlines.bind( this );
    this.getPath = this.getPath.bind( this );
    this.generateTicks = this.generateTicks.bind( this );
    if( this.props.data == null ){
      this.state = {
        data : null ,
      };
      return;
    }else{
      this.state = {
        data : this.props.data,
      };
    }
  }
  getPath({
    lineData,
    start,end,
  }){
      const height = this.width;
      const width = this.width;
      const lastDatum = lineData[ lineData.length - 1 ];
      const allYValues = lineData.map(pair=>pair[1]);
      const scaleX = createScaleX( start, end , width)
      const extentY = d3Array.extent( allYValues );
      const scaleY = createScaleY( extentY[0] , extentY[1] , width );
      return d3.shape.line()
              .x( d => scaleX( d[0] ) )
              .y( d => ( scaleY( d[1] ) ) );
  }

  generateTicks(data){
    const values = data.map( item => item[0] );
    const timeLine = data.map( item => item[1] );
    const hmin = Math.min( ...values );//height min
    const hmax = Math.max( ...values );//height max
    const gapBtwHLines = ( hmax - hmin )/ this.baseTicks.length; //gap between horizontal Lines
    const tmin = Math.min( ...timeLine );
    const tmax = Math.max( ...timeLine );
    const gapBtwVLines = ( tmax - tmin )/ this.baseTicks.length; //time gap between Vertical Lines
    this.baseTicks=this.vertiaclTicks.map((tick,i)=>(hmin+gapBtwHLines*i).toPrecision(4));
    this.vertiaclTicks=this.baseTicks.map((tick,i)=>(tmin+gapBtwVLines*(i+1)).toPrecision(6));
  }

  getlines(){
    if(this.state.data['asks']==undefined){
      return
    }
    const whole=[ ...this.state.data['asks'] , ...this.state.data['bids'] ];
    this.generateTicks( whole );

    const values = whole.map( item => item[0] );
    const start = Math.min( ...values );//height min
    const end = Math.max( ...values );//height max
      let lineData=this.state.data['asks']
      const asksValues = lineData.map( item => item[0] );
      const asksStart = Math.min( ...asksValues );//height min
      const asksEnd = Math.max( ...asksValues );//height max
      let asksData=[[asksStart,0],...lineData,[end,0]];
    const asks = this.getPath( { lineData ,start,end} );
    this.asks = asks( asksData ) + ` Z`;
      const bidsValues = this.state.data['bids'].map( item => item[0] );
      const bidsStart = Math.min( ...bidsValues );//height min
      const bidsEnd = Math.max( ...bidsValues );//height max
      let bidsData=[ [ bidsEnd , 0 ] , ...this.state.data['bids'] , [ start , 0 ] ];
    const bids = this.getPath({ lineData: this.state.data['bids'] ,start,end});
    this.bids = bids( bidsData )+ `  Z`;
    // console.log(bidsStart,bidsEnd);
    // console.log(asksStart,asksEnd);
    // console.log(this.state.data);
  }
  componentWillReceiveProps( nextProps ){
    if( nextProps.data == null || Array.isArray(nextProps.data) ){
      this.setState({
        data : null
      })
      return
    }
    this.setState({
      data : nextProps.data
    })
  }
  render(){
    this.getlines();
    if( this.state.data == null ){
      return (<View style = { styles.chartMsgView } ><Text style = {styles.chartMsg} >Unable to get the Data</Text></View>);
    }
    const textWidth=this.width/this.baseTicks.length;
    console.log("rendering MarketDepth");
    return(
      <View style = {styles.chartView}>
        <Surface width = {this.width} height = {this.width}>
          <Group x = {0} y = {0}>
          {
            this.axis.map((d,i)=>(
              <Shape
                d = {d}
                key={i+'axis'}
                stroke = '#ff0b88'
                strokeWidth = {1}
                >
              </Shape>
            ))
          }
            <Shape
              d  =  {this.bids}
              fill = '#00adef'
              strokeWidth = {1}
              >
            </Shape>
            <Shape
              d = {this.asks}
              fill = '#1fd430'
              strokeWidth = {1}
              >
            </Shape>
          </Group>
        </Surface>
        <View style={{height:60,width:this.width,flexDirection:'row'}}>
          {
            this.baseTicks.map((tick,i)=><Text style={[styles.bTickText,{width:textWidth}]} key={i+'bTick'} >{tick}</Text>)
          }
        </View>
        <View style={{position : 'absolute',right:-1,width:60,height:this.width,flexDirection:'column'}}>
          {
            this.vertiaclTicks.reverse().map((tick,i)=><Text style={[styles.bTickText,{height:textWidth}]} key={i+'vTick'} >{tick}</Text>)
          }
        </View>
      </View>
    )
  }
}
export default MarketDepth;

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
    width : windowWidth,
    marginTop:60,
    borderWidth:1,
    backgroundColor:'#474747',
    borderColor:'#ff0b88',
    height : windowWidth,
  },
  chartMsg : {
    width : windowWidth,
    color : '#eee',
    textAlign : 'center',
    fontSize : 18,
    fontWeight : 'bold',
  },
  bTickText : {
    fontSize : 10,
    color : '#ffffff',
  },
})
