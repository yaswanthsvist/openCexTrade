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
    .domain([minY, maxY])
    // We invert our range so it outputs using the axis that React uses.
    .range([height, 0]);

}

const assignStyles=(width,height)=>{
  return StyleSheet.create({
    chartMsgView : {
      flexDirection : "row",
      alignItems : 'center',
      backgroundColor : '#448aff',
      width,
      height,
    },
    chartView : {
      backgroundColor:'#474747',
      borderColor:'#fef200',
      width,
      height,
    },
    chartMsg : {
      width,
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
    linesData.push(`M0,${hValue}L${width},${hValue}`);//height will be constant ( horizontal axis)
    linesData.push(`M${wValue},0L${wValue},${height}`);//height will be constant ( verical axis)
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

const getTimeFormat=(time,type)=>{
  const d=new Date(time*1000);
  const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month=months[d.getMonth()];
  switch(type){
    case 'data1h':
    case 'data1m':
      return `${(d.getHours()>9?'':'0')+d.getHours()}:${(d.getMinutes()>9?'':'0')+d.getMinutes()}\n${d.getDate()}\n${month}`
    default:
      return `${d.getDate()}\n${month}`;
  }
}

class LineChart extends React.Component{
  constructor( props ){
    super( props )
    const {width=Dimensions.get('window').width,height=Dimensions.get('window').height}=this.props;
    this.width = width-60;
    this.height = height-60;
    this.styles=assignStyles(width,height);
    const {linesData,hValues,wValues}=generateAxis(this.width,this.height,6);
    this.axis = linesData;
    this.baseTicks=wValues;
    this.vertiaclTicks=hValues;
    this.getlines = this.getlines.bind( this );
    this.getPath = this.getPath.bind( this );
    this.generateTicks = this.generateTicks.bind( this );
    if( this.props.data == null ){
      this.state = {
        data : null ,
        sampleRatio : this.props.sampleRatio,
      };
      return;
    }else{
      this.state = {
        data : JSON.parse( this.props.data[ this.props.timeType ]),
        sampleRatio : this.props.sampleRatio ,
      };
    }
  }
  getPath(
    lineData,
    scale = 1
   ){
     const width = this.width;
     const height = this.height;
     const lastDatum = lineData[ lineData.length - 1 ];
     const allYValues = lineData.reduce( ( all , datum ) => {
        all.push( parseInt( datum.value ) );
        return all;
      }, [] );
      const scaleX = createScaleX( lineData[0].time , lastDatum.time , width)
      const extentY = d3Array.extent( allYValues );
      const scaleY = createScaleY( extentY[0] , extentY[1] , height );
      return d3.shape.line()
              .x( d => scaleX( d.time ) )
              .y( d => ( scaleY( d.value * scale ) ) );
  }

  generateTicks(data){
    const values = data.map( item => item.value );
    const timeLine = data.map( item => item.time );
    const hmin = Math.min( ...values );//height min
    const hmax = Math.max( ...values );//height max
    const gapBtwHLines = ( hmax - hmin )/ this.baseTicks.length; //gap between horizontal Lines
    const tmin = Math.min( ...timeLine );
    const tmax = Math.max( ...timeLine );
    const gapBtwVLines = ( tmax - tmin )/ this.baseTicks.length; //time gap between Vertical Lines
    this.baseTicks=this.baseTicks.map((tick,i)=>{return getTimeFormat((tmin+gapBtwVLines*i),this.props.timeType)});
    this.vertiaclTicks=this.vertiaclTicks.map((tick,i)=>(hmin+gapBtwHLines*i).toPrecision(8));
  }

  getlines(){
    if( this.state.data == null){
      return
    }
    const {data}=this.state;
    const [TIMESTAMP,OPEN,CLOSE,HIGH,LOW,VOLUME]=[0,1,2,3,4,5];
    const values = data.map( item => item[TIMESTAMP] );
    const [hmin,hmax] = d3Array.extent( values );//height min
    const avg=(hmax-hmin)/100;
    const minFilter=hmin+avg*this.props.minTime;
    const maxFilter=hmin+avg*this.props.maxTime;
    let highData = data
      .filter(candle=>(minFilter<=candle[TIMESTAMP])&&(candle[TIMESTAMP]<=maxFilter))
      .filter( ( candle , index ) => { return ( !( index%this.state.sampleRatio ) ) } )//sampling data here
      .map( candle => {
        return { time : new Date( candle[ TIMESTAMP ] ) , value : candle[ HIGH ] }
      });
      if(highData.length==0){
        return
      }
    let lowData = data
      .filter(candle=>(minFilter<=candle[TIMESTAMP])&&(candle[TIMESTAMP]<=maxFilter))
      .filter( ( candle , index ) => { return ( !( index%this.state.sampleRatio ) ) })//sampling data here
      .map( candle => ( { time : new Date( candle[ TIMESTAMP ] ) , value : candle[ LOW ] } ) );
    let volumeData = data
      .filter(candle=>(minFilter<=candle[TIMESTAMP])&&(candle[TIMESTAMP]<=maxFilter))
      .filter( (candle,index) => { return ( !( index%this.state.sampleRatio ) ) } )//sampling data here
      .map( candle => ( { time : new Date( candle[ TIMESTAMP ] ) , value : candle[ VOLUME ] } ) );// 5 is for volume

    this.generateTicks( highData );
    const high = this.getPath( highData )
    this.high = high( highData );
    const low = this.getPath( lowData )
    this.low = low( lowData );
    const volume = this.getPath( volumeData , 0.3 )
    this.volume = `M0 ${ this.height } ` + volume( volumeData ).slice( 1 ) + `L${ this.width } ${ this.height } Z`;
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
    const {styles,width,height,baseTicks,vertiaclTicks}=this;
    if( this.state.data == null ){
      return (<View style = { styles.chartMsgView } ><Text style = {styles.chartMsg} >Unable to get the Data</Text></View>);
    }
    const textWidth=this.width/this.baseTicks.length;
    const textHeight=height/vertiaclTicks.length;
    return(
      <View style = {styles.chartView}>
        <Surface width = {width} height = {height}>
          <Group x = {0} y = {0}>
          {
            this.axis.map((d,i)=>(
              <Shape
                d = {d}
                key={i+'axis'}
                stroke = '#ff0b88'
                strokeWidth = {0.5}
                >
              </Shape>
            ))
          }
            <Shape
              d  =  {this.high}
              stroke = '#1faa00'
              strokeWidth = {1.5}
              >
            </Shape>
            <Shape
              d = {this.low}
              stroke = '#c300'
              strokeWidth = {1.5}
              >
            </Shape>
            <Shape
              d = {this.volume}
              fill = 'rgba( 0, 173, 239 , 0.7 )'
              >
            </Shape>

          </Group>
        </Surface>
        <View style={{height:70,width,flexDirection:'row'}}>
          {
            baseTicks.map((tick,i)=><Text style={[styles.bTickText,{width:textWidth}]} key={i+'bTick'} >{tick}</Text>)
          }
        </View>
        <View style={{position : 'absolute',right:-1,width:60,height:this.width,flexDirection:'column'}}>
          {
            vertiaclTicks.reverse().map((tick,i)=><Text style={[styles.bTickText,{height:textHeight}]} key={i+'vTick'} >{tick}</Text>)
          }
        </View>
      </View>
    )
  }
}
export default LineChart;
