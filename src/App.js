import React, { Component }  from 'react'
import {createBottomTabNavigator, createAppContainer,createStackNavigator} from 'react-navigation'
import MainContainer from './container/main'
import ChatroomContainer from './container/chatroom'
import AboutMy from './container/my'
import FriendList from './container/friendList'
import Ionicons from "react-native-vector-icons/Ionicons";




const ChatStackNavigator = createBottomTabNavigator({
    消息: { screen: MainContainer },
    通讯录: { screen: FriendList },
    我的: {screen: AboutMy},
},{
    navigationOptions: ({navigation}) => ({
        tabBarIcon: ({focused, tintColor}) => {
            const {routeName} = navigation.state;
            let iconName;
            if (routeName === '消息') {
                iconName = `ios-text${focused ? '' : ''}`;
            } else if (routeName === '通讯录') {
                iconName = `ios-people${focused ? '' : ''}`;
            } else if (routeName === '我的') {
                iconName = `ios-person${focused ? '' : ''}`;
            }

            // 在此处可以返回任何组件！
            // 我们通常使用react-native-vector-icons中的图标组件
            return <Ionicons name={iconName} size={25} color={tintColor}/>;
        },
    }),
    tabBarOptions: {
        activeTintColor: '#1EA114',
        inactiveTintColor: 'gray',
    },



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