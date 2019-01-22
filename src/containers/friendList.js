/**
 *
 * @flow
 *
 * 好友列表
 * 暂时废除理由：需要显示单聊、群聊。因此把原来消息页的逻辑改成通讯录页。重写页面为AddressBook.js
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, Button } from 'react-native'
import Icon from "react-native-vector-icons/Ionicons";
import { getFriendsInfo } from '../api/index';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loginActions } from '../actions/index'


class FriendListScreen extends React.Component {

    render() {
        const { profile } = this.props
        const friendsInfo = getFriendsInfo('/getFriendsInfo').data

        return (
            <View style={{ flex: 1 }}>{
                friendsInfo.map((friend, index) =>

                    <TouchableOpacity style={styles.chatItem} key={index} key={index} onPress={() => {
                        this.props.navigation.navigate('SingleChatroom', {
                            chatType: 0, // 单聊
                            chatWithId: friend.id,
                            showName: friend.username,
                            myProfile: profile,
                        })
                    }}>
                        <View style={{ height: 20, width: 20 }}>
                            <Icon name="md-people" size={20} color='#1EA114' />
                        </View>
                        <View style={{ marginHorizontal: 10 }}>
                            <Text style={{ fontSize: 16, color: 'rgb(143,163,174)' }}>{friend.username}</Text>
                        </View>
                    </TouchableOpacity>)}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    chatBlock: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        paddingHorizontal: 25,
        paddingVertical: 20,
        height: 60,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc'

    },
    tip: {
        height: 20,
        width: 20,
        backgroundColor: 'rgb(205,85,66)',
        borderRadius: 5
    },
    tipText: {
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',//好友列表全部
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        height: 50,
        paddingHorizontal: 25,
        paddingVertical: 10
    }
});

function mapStateToProps(state) {
    return {
        profile: state.chat.profile
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...loginActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendListScreen)

//export default FriendListScreen;