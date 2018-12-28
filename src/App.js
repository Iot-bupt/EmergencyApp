import React, { Component } from 'react'
import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation'
import MainContainer from './containers/main'
import SingleChatroomContainer from './containers/SingleChatroom'
import PublicChatroomContainer from './containers/PublicChatroom'
import InspectionContainer from './containers/Inspection'
import AboutMy from './containers/my'
import FriendList from './containers/friendList'
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



//配置navigator
const ChatStackNavigator = createBottomTabNavigator({
    消息: { screen: MainContainer },
    通讯录: { screen: FriendList },
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

                
                return <Ionicons name={iconName} size={25} color={tintColor} />;
            },
        }),
        tabBarOptions: {
            activeTintColor: '#1EA114',
            inactiveTintColor: 'gray',
        },



    });
const AppNavigator = createStackNavigator({

    Home: ChatStackNavigator,
    SingleChatroom: SingleChatroomContainer,
    PublicChatroom: PublicChatroomContainer,
    Inspection: InspectionContainer,
}, {
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