import React, { Component } from 'react'
import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation'
import ChatList from './containers/ChatList'
import LoginContainer from './containers/Login'
import SingleChatroomContainer from './containers/SingleChatroom'
import PublicChatroomContainer from './containers/PublicChatroom'
import InspectionContainer from './containers/Inspection'
import VideoChatContainer from './containers/VideoChat'
import AboutMy from './containers/my'
import AddressBook from './containers/AddressBook'
import Ionicons from "react-native-vector-icons/Ionicons";
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import reducer from '../src/reducers';
import {
    reduxifyNavigator,
    createReactNavigationReduxMiddleware,
    createNavigationReducer,
} from 'react-navigation-redux-helpers';



//配置tab navigator
const TabNavigator = createBottomTabNavigator({
    消息: { screen: ChatList },
    通讯录: { screen: AddressBook },
    我的: { screen: AboutMy },
}, {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
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
                return <Ionicons name={iconName} size={25} color={tintColor} />;
            },
        }),
        tabBarOptions: {
            activeTintColor: '#1EA114',
            inactiveTintColor: 'gray',
        },
    });

// fix:解决React-navigation 2.0版本header设置无效的问题
TabNavigator.navigationOptions = ({ navigation }) => {
    const component = TabNavigator.router.getComponentForState(navigation.state)
    if (typeof component.navigationOptions === 'function') {
        return component.navigationOptions({ navigation })
    }
    return component.navigationOptions
}


// 合并tab与react-navigation
const AppNavigator = createStackNavigator({

    Home: TabNavigator,
    Login: LoginContainer,
    SingleChatroom: SingleChatroomContainer,
    PublicChatroom: PublicChatroomContainer,
    Inspection: InspectionContainer,
    VideoChat: VideoChatContainer //视频路由
}, {
        initialRouteName: 'Login',
        navigationOptions: {
            title: '智能巡检客户端',
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


//React-navigation整合Redux
const navReducer = createNavigationReducer(AppNavigator);
const appReducer = combineReducers({
    nav: navReducer,
    chat: reducer
});

const middleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
);

const AppNav = reduxifyNavigator(AppNavigator, "root");
const mapStateToProps = (state) => ({
    state: state.nav,
});
const AppWithNavigationState = connect(mapStateToProps)(AppNav);
const store = createStore(
    appReducer,
    applyMiddleware(middleware, thunkMiddleware),
);

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <AppWithNavigationState />
            </Provider>
        );
    }
}