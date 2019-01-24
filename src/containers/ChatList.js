/**
 *
 * @flow
 *
 * 消息：展示聊天消息记录
 * @TODO 消息持久化
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, ListView, Image } from 'react-native';
import { genToken } from '../api/index';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loginActions, chatActions, locationActions } from '../actions/index'

class ChatList extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //路由跳转时携带的参数
        var userid = this.props.navigation.getParam('userid', {}) //@param myProfile:个人信息

        //根据用户id获取用户名
        this.getProfileById(userid)
    }

    getProfileById = (id) => {
        const { actions } = this.props

        let url = 'http://10.112.17.185:8086/api/v1/user/userById?Id=' + id
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

    render() {
        return (
            <View></View>
        )
    }
}

function mapStateToProps(state) {
    return {
        profile: state.chat.profile
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...chatActions, ...loginActions, ...locationActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatList)