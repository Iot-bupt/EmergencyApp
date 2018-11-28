import React, { Component }  from 'react'
import {createBottomTabNavigator, createAppContainer,createStackNavigator} from 'react-navigation'
import MainContainer from './container/main'
import ChatroomContainer from './container/chatroom'
import AboutMy from './container/my'
import FriendList from './container/friendList'
import Icon from "react-native-vector-icons/Ionicons";




const ChatStackNavigator = createBottomTabNavigator({
    消息: { screen: MainContainer },
    通讯录: { screen: FriendList },
    我的: {screen: AboutMy},
});



const RootStack = createStackNavigator({

  Home: ChatStackNavigator,
  Chatroom: ChatroomContainer,
},{
    navigationOptions: {
        title: '应急指挥',
        headerStyle: {
            backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    }
    }
);

export default class App extends Component {
  render() {
    return <RootStack />;
  }
}