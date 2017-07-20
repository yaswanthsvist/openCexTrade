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
      marginTop:60,
      borderWidth:1,
      backgroundColor:'#474747',
      borderColor:'#ff0b88',
      width,
      height,
    },
    chartMsg : {
      color : '#eee',
      textAlign : 'center',
      fontSize : 18,
      fontWeight : 'bold',
      width,
    },
    bTickText : {
      fontSize : 10,
      color : '#ffffff',
    },
  })
}
const filterToBars=(data,noOfBars) => {
  let xvalues=data.map(x=>x[0]);
  let min=Math.min.apply(null,xvalues);
  let max=Math.max.apply(null,xvalues);
  console.log(min,max);
  gap=(max-min)/(noOfBars-1);
  filteredArray=[];
  for(pres=min;pres<= (max);pres=pres+gap){
    filteredArray.push([
      pres ,
       data.filter(x =>( pres <= x[0] && (pres+gap) > x[0] ) )
        .map(x=>x[1]).reduce((a,b)=>a+b,0)
     ]);
  }
  return filteredArray;
}

class CandleChart extends React.Component{
  constructor( props ){
    super( props )
    const {width=Dimensions.get('window').width,height=Dimensions.get('window').width}=this.props;
    this.width = width-60;
    this.height = height-30;
    this.bids=[];
    this.asks=[];
    this.styles=assignStyles(width,height);

    const {linesData,hValues,wValues}=generateAxis(this.width,this.height,6);
    this.axis = linesData;
    this.currentPriceAxis='';
    this.baseTicks=wValues;
    this.vertiaclTicks=hValues;
    this.getlines = this.getlines.bind( this );
    this.getPath = this.getPath.bind( this );
    this.generateTicks = this.generateTicks.bind( this );
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
  getPath({
    xvalues,
    yvalues,
  }){
    let [ start , end ] = d3Array.extent( xvalues );
    let barWidth=( xvalues[0]-xvalues[1])/5;
    end=end+barWidth*5;
    const [ymin,ymax] = d3Array.extent(yvalues);//height min
    const scaleX = createScaleX( start, end , this.width)
    const scaleY = createScaleY( ymin , ymax , this.height );

      return d3.shape.line()
              .x( d => scaleX( d[0] ) )
              .y( d => ( scaleY( d[1] ) ) );
  }

  /*
  getlines : generate candle d3 path/ shapes for respective time stamp.
  @ data=[
            [
              1500055200000, //time stamp
              2195.4 ,       //open
              2209.7 ,       //close
              2215 ,         //high
              2174 ,         //low
              2241.22567577  // volume
            ],
            ...
          ];
  */

  getlines(){

    const {data,maxCandles=30}=this.props;
    const [TIMESTAMP,OPEN,CLOSE,HIGH,LOW]=[0,1,2,3,4];
    if(data.length==0){
      return
    }
    const whole = [
      ...data.map( x => [ x[ TIMESTAMP ] , x[ HIGH ] ] ) ,
      ...data.map( x => [ x[ TIMESTAMP ] , x[ LOW] ] )
     ].slice(0,maxCandles);

    this.generateTicks( whole );

    const xvalues = whole.map( item => item[ TIMESTAMP ] );
    const yvalues = whole.map( item => item[1] );
    let barWidth=( xvalues[0]-xvalues[1])/5;
    const [ymin,ymax] = d3Array.extent(yvalues);//height min
    let [ start , end ] = d3Array.extent( xvalues );
    end=end+barWidth*5;

    const generateCandleBarEdges=(x)=>([
      [ x[ TIMESTAMP ] - barWidth , x[ OPEN ] ] ,
      [ x[ TIMESTAMP ] - barWidth , x[ CLOSE ] ] ,
      [ x[ TIMESTAMP ] + barWidth , x[ CLOSE ] ] ,
      [ x[ TIMESTAMP ] + barWidth , x[ OPEN ] ] ,
    ]);
    const generateCandleStickEdges=(x)=>([
      [ x[ TIMESTAMP ]  , x[ LOW ] ],
      [ x[ TIMESTAMP ]  , x[ HIGH ] ] ,
    ]);

    //manipulation of min max to diplay content at edges of graphs
    const yGap = (ymax-ymin)*2/this.height;
    let currentPrice=(  (data[0][CLOSE]==ymax) ? ( data[0][CLOSE]-yGap) :( (data[0][CLOSE]==ymin) ? (data[0][CLOSE]+yGap) : data[0][CLOSE]) );
    const currentPriceEdges=[ [ start , currentPrice ] , [ end , currentPrice ] ];
    this.isFalling  = data.slice(0,maxCandles).map( x =>( x[ OPEN ] < x[ CLOSE ]))

    const path=this.getPath( { xvalues,yvalues } )

    let openClose = data.slice(0,maxCandles).map( generateCandleBarEdges );
    let lowHighs = data.slice(0,maxCandles).map( generateCandleStickEdges );

    this.bars  = openClose.map( lineData => ( path( lineData ) + ` Z`) ) ;
    this.sticks = lowHighs.map( lineData => ( path( lineData ) ) ) ;
    this.currentPriceAxis = path( currentPriceEdges );
  }

  componentWillReceiveProps( nextProps ){
    this.setState({
      data : nextProps.data
    });
  }
  render(){
    this.getlines();
    const {styles,width,height,baseTicks,vertiaclTicks}=this;
    if( this.props.data.length == 0 ){
      return (<View style = { styles.chartMsgView } ><Text style = {styles.chartMsg} >Unable to get the Data</Text></View>);
    }
    const textWidth=width/baseTicks.length;
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
                stroke = 'rgba(255, 11, 136,0.3)'
                strokeWidth = {1}
                >
              </Shape>
            ))
          }

          {this.sticks.map((stick,i)=>(<Shape
              d = {stick}
              stroke = '#000'
              key={i+'candleStick'}
              strokeWidth = {1}
              >
              </Shape>))
            }
          {this.bars.map((bar,i)=>(<Shape
              d  =  {bar}
              key={i+'candleBar'}
              fill = {(this.isFalling[i]==false)?'#c300':'rgb(31, 212, 48)'}
              //fill = 'rgb(0, 173, 239,0.8)'
              strokeWidth = {1}
              >
            </Shape>))
          }
          <Shape
            d = {this.currentPriceAxis}
            stroke = 'rgba( 0, 173, 239 , 1 )'
            strokeWidth = {0.5}
            >
          </Shape>
         </Group>
        </Surface>
        <View style={{height:60,width:width,flexDirection:'row'}}>
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
export default CandleChart;
