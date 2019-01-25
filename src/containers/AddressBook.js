/**
 *
 * @flow
 *
 * 通讯录：好友、群聊
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, ListView, Image } from 'react-native';
import CoverageCell from '../components/coverageCell';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loginActions } from '../actions/index'

var CoverageArrs = [{
    title: '联系人', persons: [], chatType: 'user'
}, {
    title: '群聊', persons: [], chatType: 'group'
}]

class AddressBook extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        };
    }

    renderMover(data) {
        const { profile } = this.props
        const { title, persons, chatType } = data;
        return (
            <CoverageCell title={title} cars={persons} chatType={chatType} myProfile={profile} detail={this.detail.bind(this)} navigation={this.props.navigation} />
        )
    }

    componentDidMount() {
        const { profile } = this.props
        this.getFriendsInfo(profile.id)
        //this.getGroupsInfo(profile.id)
    }

    getFriendsInfo = (id) => {
        let url = 'http://39.104.189.84:30300/api/v1/user/user?Id=' + id
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/html',
            }
        }).then((res) => {
            if (res.status == '200') {
                res.json()
                    .then((json) => {
                        CoverageArrs[0].persons = json
                        // fix:两个异步请求后分别setstate，会导致点击无法收缩展开
                        /* 解决方法：在一个请求成功后再请求第二个，强制给两个异步请求排序
                        * 缺点：耦合性太强
                        * this.getGroupsInfo(id)
                        */
                        this.getGroupsInfo(id)
                    })
            } else {
                Toast.showShortCenter('网络请求错误:' + res.status)
            }
        }).catch((error) => {
            console.error("error")
            console.error(error)
        })
    }

    getGroupsInfo = (id) => {
        let url = 'http://39.104.189.84:30300/api/v1/user/groupByUserId?userId=' + id
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/html',
            }
        }).then((res) => {
            if (res.status == '200') {
                res.json()
                    .then((json) => {
                        CoverageArrs[1].persons = json
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(CoverageArrs),
                        });
                    })
            } else {
                Toast.showShortCenter('网络请求错误:' + res.status)
            }
        }).catch((error) => {
            console.error("error")
            console.error(error)
        })
    }

    detail(title) {
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.chatlist}>
                    <View style={{ flex: 1 }}>
                        <ListView style={{ flex: 1 }} dataSource={this.state.dataSource} renderRow={this.renderMover.bind(this)} />
                    </View>
                </View>
            </View>
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
        actions: bindActionCreators({ ...loginActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressBook)

const styles = StyleSheet.create({
    chatlist: {
        backgroundColor: '#f2f2f2',
        height: 800
    }
});
