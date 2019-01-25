/**
 *
 * @flow
 *
 * 消息：展示聊天消息记录
 * @TODO 消息持久化
 * 
 * 消息格式(当前账户id为216)
 * 单聊发送消息：{createTime: 1548247346000, msgType: 0, fromUserId: 216, toUserId: 205, content: "test"}
 * 单聊接收消息：{createTime: 1548331944918, msgType: 0, fromId: 205,content: "3333",expireTime: 0,id: 0,msgContentType: 0,target: {id: 216, type: -1}}
 * 群聊发送消息：{createTime: 1548247539000, msgType: 1, fromUserId: 216, toUserId: 2, content: "33"}
 * 群聊接受消息：{createTime":1445676996823, msgType: 1,"fromId":205,"target":{"id":"2","type":-1},"content":"test","expireTime":0,"id":0}
 */

import './setUserAgent.js'
import React, { Component } from 'react';
import { StyleSheet, View, Text, ListView, Image, FlatList, TouchableHighlight, Dimensions, PixelRatio } from 'react-native';
import { genToken } from '../api/index';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TimeUtil from '../utils/TimeUtil';
import { loginActions, chatActions, locationActions } from '../actions/index'
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get('window');

//@TODO 待优化
//为了防止此数据在页面加载时丢失，存为全局变量
var userMap = {}

class ChatList extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            chatList: []
        }
    }

    componentDidMount() {
        //路由跳转时携带的参数
        var userid = this.props.navigation.getParam('userid', {}) //@param myProfile:个人信息

        //根据当前用户id获取账户信息
        this.getProfileById(userid)

        //获取所有用户名和id
        this.getAllFriends(userid)
    }

    getAllFriends = (id) => {
        //var userMap = {}
        let getfriend_url = 'http://39.104.189.84:30300/api/v1/user/user?Id=' + id
        //获取所有单聊联系人
        fetch(getfriend_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/html',
            }
        }).then((res) => {
            if (res.status == '200') {
                res.json()
                    .then((json) => {
                        json.map(function (friend, index) {
                            userMap[friend.id] = friend.name
                        })

                        //获取所有群聊联系人
                        let getgroup_url = 'http://39.104.189.84:30300/api/v1/user/groupByUserId?userId=' + id
                        fetch(getgroup_url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'text/html',
                            }
                        }).then((res) => {
                            if (res.status == '200') {
                                res.json()
                                    .then((json) => {
                                        json.map(function (group, index) {
                                            userMap[group.id] = group.name
                                        })

                                        //fix:如果把数据保存在state，由于componentDidMount只在初始化时运行一次，页面再加载时此数据会丢失报错bug
                                        //this.setState({ userMap })
                                    })
                            } else {
                                Toast.showShortCenter('网络请求错误:' + res.status)
                            }
                        }).catch((error) => {
                            console.error("error")
                            console.error(error)
                        })
                    })
            } else {
                Toast.showShortCenter('网络请求错误:' + res.status)
            }
        }).catch((error) => {
            console.error("error")
            console.error(error)
        })
    }

    getProfileById = (id) => {
        const { actions } = this.props

        let url = 'http://39.104.189.84:30300/api/v1/user/userById?Id=' + id
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/html',
            }
        }).then((res) => {
            if (res.status == '200') {
                res.json()
                    .then((json) => {
                        //@TODO fetch中编写逻辑，这样写耦合性太强？
                        //console.log(json)
                        //@TODO 获取token两个
                        var data = genToken()

                        var authString = JSON.stringify({
                            id: json.id,
                            name: json.name,
                            token1: data.token1,
                            token2: data.token2
                        })
                        actions.connectChat(authString) // redux管理聊天socket连接
                        actions.connectLocation(json.name) // redux管理定位信息socket连接
                        actions.setMyProfile(json) // redux管理全局用户信息
                    })
            } else {
                Toast.showShortCenter('网络请求错误:' + res.status)
            }
        }).catch((error) => {
            console.error("error")
            console.error(error)

        })
    }

    loadConvertions = (messageArr) => {
        /*@TODO 本函数处理逻辑
        *对redux中存储的message进行整理，整理结果为对方id,对方name,最新message,msgType,unreadcount,timestamp
        */
        var userid = this.props.navigation.getParam('userid', {}) //@param myProfile:个人信息
        var chatList = {}
        messageArr.forEach(msg => {
            var tempId = '' //获取当前聊天对象id

            //群聊接受消息，需要从target取群聊id
            if (msg.msgType === 1 && msg.fromId) { 
                tempId = msg.target.id
            } else {
                tempId = msg.toUserId || msg.fromId
            }

            //bug：群聊消息的接受方包括自己
            if (msg.msgType === 1 && msg.fromId === userid) {
                // console.log('自己发送的群聊消息')
                return false
            }
            //查找chatlist中的key是否包含该id
            if (!chatList[tempId]) { 
                var tempName = this.getNameById(tempId)

                chatList[tempId] = {
                    chatWithId: tempId,
                    chatWithName: tempName,
                    msgType: msg.msgType,
                    lastMsg: msg.content,
                    createTime: msg.createTime
                }
            } else {
                chatList[tempId]['lastMsg'] = msg.content
                chatList[tempId]['createTime'] = msg.createTime
            }
        });
        //this.setState({ chatList })
        return chatList
    }

    getNameById = (id) => {
        //const { userMap } = this.state
        return userMap[id]
    }

    renderItem = (data) => {
        const { profile } = this.props
        const { chatWithId, chatWithName, lastMsg, msgType, createTime } = data.item

        return (
            <View>
                <TouchableHighlight onPress={() => {
                    if (msgType === 0) {
                        this.props.navigation.navigate('SingleChatroom', {
                            chatType: 'user',
                            chatWithId: chatWithId,
                            showName: chatWithName,
                            myProfile: profile,
                        })
                    } else if (msgType === 1) {
                        this.props.navigation.navigate('PublicChatroom', {
                            chatType: 'group',
                            chatWithId: chatWithId,
                            showName: chatWithName,
                            myProfile: profile,
                        })
                    }
                }}>
                    {/* <View style={styles.listItemContainer}>
                        <View style={styles.listItemSubContainer}>
                            <Text>用户{chatWithId}</Text>
                        </View>
                        <View style={styles.listItemSubContainer}>
                            <Text>用户{chatWithId}</Text>
                        </View>
                    </View> */
                        <View style={styles.listItemContainer}>
                            {/* 头像 <Image source={''} style={{ width: 50, height: 50 }} backgroundColor='#dcdcdc' /> */}
                            {(msgType === 0) ?
                                <Icon name="md-person" size={30} color='rgb(173,185,191)' />
                                :
                                <Icon name="md-people" size={30} color='rgb(173,185,191)' />
                            }

                            <View style={styles.listItemTextContainer}>
                                <View style={styles.listItemSubContainer}>
                                    <Text numberOfLines={1} style={styles.listItemTitle}>{chatWithName}</Text>
                                    <Text numberOfLines={1} style={styles.listItemTime}>{TimeUtil.formatChatTime(createTime)}</Text>
                                </View>
                                <View style={styles.listItemSubContainer}>
                                    <Text numberOfLines={1} style={styles.listItemSubtitle}>{lastMsg}</Text>
                                    {/* 未读气泡
                                    {
                                        data.item.unreadCount > 0 ? (
                                            <View style={styles.redDot}>
                                                <Text style={styles.redDotText}>{data.item.unreadCount}</Text>
                                            </View>
                                        ) : (null)
                                    } */}
                                </View>
                            </View>
                        </View>}
                </TouchableHighlight>
                <View style={styles.divider} />
            </View>
        )
    }

    render() {
        const { chat } = this.props
        //bug 不能在render内setstate
        /* 方法一：在render中处理消息，不保存到state
         * 方法二：找其他地方处理消息
         */
        var chatListObj = this.loadConvertions(chat.messages)
        var chatListArr = []
        //把对象chatListObj的值存为数组chatListArr
        for (i in chatListObj) {
            chatListArr.push(chatListObj[i])
        }
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    {
                        chatListArr.length == 0 ? (
                            <Text style={styles.emptyHintText}>暂无会话消息</Text>
                        ) : (
                                < FlatList
                                    ref="flatList"
                                    data={chatListArr}
                                    renderItem={this.renderItem}
                                    keyExtractor={this._keyExtractor}
                                    extraData={this.state}
                                />
                            )
                    }
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        profile: state.chat.profile,
        chat: state.chat
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...chatActions, ...loginActions, ...locationActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatList)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        width: width,
        alignItems: 'center' //垂直居中
    },
    divider: {
        width: width,
        height: 1 / PixelRatio.get(),
        backgroundColor: '#D3D3D3'
    },
    emptyHintText: {
        fontSize: 17,
        color: '#999999'
    },
    listItemContainer: {
        flexDirection: 'row',
        width: width,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    listItemTextContainer: {
        flexDirection: 'column',
        flex: 1,
        paddingLeft: 15,
    },
    listItemSubContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemTitle: {
        color: '#333333',
        fontSize: 16,
        flex: 1,
    },
    listItemTime: {
        color: '#999999',
        fontSize: 12,
    },
    listItemSubtitle: {
        color: '#999999',
        fontSize: 14,
        marginTop: 3,
        flex: 1,
    },
})