import React from 'react';
import { StyleSheet, Text,Button, View,ScrollView,StatusBar,Image } from 'react-native';
import {addNavigationHelpers,TabNavigator,DrawerNavigator,StackNavigator,DrawerItems} from 'react-navigation';
import Deposit from './../components/Deposit';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Exchange from "./../components/Exchange";
import Authenticate from "./../components/Authenticate";
import Trade from "./../components/Trade";
import Bids from "./../components/Bids";

const DrawerComponent=(props)=>(
  <View style={{flex:1}}>
    <View style={{flex:3,paddingBottom:20,paddingTop:20,backgroundColor:"#095974",justifyContent:'center'}}>
      <Image source={require('../assets/img/cex.png')} style={{height:80,resizeMode:"contain",marginLeft:'auto',marginRight:'auto',}} />
    </View>
    <View style={{flex:7}}>
      <DrawerItems {...props}/>
    </View>
  </View>
)

const tabConfig={
  Exchange:{
    screen:Exchange,
    },

  Trade:{
    screen:Trade,
    },

  Bids:{
    screen:Bids
    },
};
const ExchangeTab=TabNavigator(tabConfig,{
  initialRouteName:"Exchange",
  tabBarPosition:"bottom"
})
const TradeTab=TabNavigator(tabConfig,{
  initialRouteName:"Trade",
  tabBarPosition:"bottom"
})
const BidsTab=TabNavigator(tabConfig,{
  initialRouteName:"Bids",
  tabBarPosition:"bottom"
})
export const AppNavigator=DrawerNavigator({
    Exchange:{
      screen:ExchangeTab,
    },
    Authenticate:{
      screen:Authenticate,
    },
    Deposit:{
      screen:Deposit,
    }
  },{
    contentComponent:DrawerComponent,
    drawerWidth:240
  }
)


const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});
const mapDispatchToProps=(dispatch)=>{
  return {
    dispatch,
  }
}

export default AppWithNavigationState=connect(mapStateToProps)(AppWithNavigationState);
