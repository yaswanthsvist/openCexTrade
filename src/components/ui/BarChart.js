import React from 'react';
import { StyleSheet,Dimensions, Text, View,ScrollView,StatusBar,Image } from 'react-native';
import {ART} from "react-native";
import * as scale from "d3-scale";
import * as shape from "d3-shape";
import * as d3Array from "d3-array";
import throttle from 'lodash/throttle'
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
const generateBar=(x,y)=>{

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
      borderColor:'#fef200',
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
const generateEdges=(x,barWidth)=>([
  [ x[0]-barWidth , 0 ],
  [ x[0]-barWidth , x[1] ] ,
  [ x[0]+barWidth , x[1] ] ,
  [ x[0]+barWidth , 0 ]
]);

const filterToBars=(data,noOfBars) => {
  let xvalues=data.map(x=>x[0]);
  let min=Math.min.apply(null,xvalues);
  let max=Math.max.apply(null,xvalues);
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

class BarChart extends React.Component{
  constructor( props ){
    super( props )
    const {width=Dimensions.get('window').width,height=Dimensions.get('window').width}=this.props;
    this.width = width-60;
    this.height = height-30;
    this.bids=[];
    this.asks=[];
    this.styles=assignStyles(width,height);
    this.props.throttle=this.props.throttle||0;

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
      };
      return;
    }else{
      this.state = {
        data : this.props.data,
      };
    }
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
    const [ymin,ymax] = d3Array.extent(yvalues);//height min
    const scaleX = createScaleX( start, end , this.width)
    const scaleY = createScaleY( ymin , ymax , this.height );

      return d3.shape.line()
              .x( d => scaleX( d[0] ) )
              .y( d => ( scaleY( d[1] ) ) );
  }


  getlines(){
//    console.log(this.state.data);
    if(this.state.data['asks']==undefined){
      return
    }
    const whole=[ ...this.state.data['asks'] , ...this.state.data['bids'] ];
    this.generateTicks( whole );

    const {maxbars=16}=this.props;

    let asksData=filterToBars(this.state.data['asks'],maxbars/2);
    let bidsData=filterToBars(this.state.data['bids'],maxbars/2);

    const xvalues = [...asksData,...bidsData].map( item => item[0] );
    const yvalues =[...asksData,...bidsData].map( item => item[1] );
    const path=this.getPath( { xvalues,yvalues } )

    //get the gap between two consecutive bar's x positions
    let barWidth=( asksData[0][0] - asksData[1][0] )/5;
    let asksBarData = asksData.map( ( x ) => generateEdges( x , barWidth ) );
    let bidsBarData = bidsData.map( ( x ) => generateEdges( x , barWidth ) );

    this.asks = asksBarData.map( lineData => ( path( lineData ) + ` Z` ) ) ;
    this.bids = bidsBarData.map( lineData => ( path( lineData ) + ` Z` ) ) ;
  }
  componentWillReceiveProps( nextProps ){
    this.setState({
      data : nextProps.data
    });
  }
  render=(throttle(()=>{
      this.getlines();
      const {styles,width,height,baseTicks,vertiaclTicks}=this;
      if( this.state.data == null ){
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
                  stroke = '#ff0b88'
                  strokeWidth = {0.5}
                  >
                </Shape>
              ))
            }
            {this.bids.map((bid,i)=>(<Shape
                d  =  {bid}
                key={i+'bidsBar'}
                fill = 'rgb(0, 173, 239)'
                strokeWidth = {1}
                >
              </Shape>))
            }
            {this.asks.map((ask,i)=>(<Shape
                d = {ask}
                fill = 'rgb(31, 212, 48)'
                key={i+'asksBar'}
                strokeWidth = {1}
                >
                </Shape>))
              }
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
    },this.props.throttle)
  )
}
export default BarChart;
