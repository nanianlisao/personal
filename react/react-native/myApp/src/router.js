import React from "react";
import Home from "~/pages/Home"
import Login from "~/pages/Login"
import Order from "~/pages/Order"
import Setting from "~/pages/Setting"
import { createStackNavigator, createAppContainer } from "react-navigation";


const Router = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        header: null
      }
    },
    Home: {
      screen: Home,
      navigationOptions: {
        headerTitleStyle: {color: '#ffffff'},
        headerStyle: {backgroundColor: '#FF9900'},
      }
    },
    Order: {
      screen: Order,
      navigationOptions: {
        // header: null,
        headerTitle: '收款记录',
        headerTitleStyle: {color: '#ffffff'},
        headerStyle: {backgroundColor: '#FF9900'},
      }
    },
    Setting: {
      screen: Setting,
      navigationOptions: {
        headerTitle: '设置与管理',
        headerTitleStyle: {color: '#ffffff'},
        headerStyle: {backgroundColor: '#FF9900'},
      }
    },
  },
  {
    initialRouteName: "Home"
  }
);


export default createAppContainer(Router);