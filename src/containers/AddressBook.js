/**
 *
 * @flow
 *
 * 通讯录：好友、群聊
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, ListView, Image } from 'react-native';
import CoverageCell from '../components/coverageCell';
import { getFriendsInfo, getGroupsInfo } from '../api/index';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loginActions } from '../actions/index'

// 初始化获取数据
// @TODO 代码放在这里合适吗？
const friendsInfo = getFriendsInfo('/getFriendsInfo').data
const groupsInfo = getGroupsInfo('/getGroupsInfo').data

// CoverageArrs:处理后传入组件的数据
var CoverageArrs = [{
    title: '联系人', persons: friendsInfo, chatType: 'user'
}, {
    title: '群聊', persons: groupsInfo, chatType: 'group'
}]

class AddressBook extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(CoverageArrs),
        };
    }

    renderMover(data) {
        const { profile } = this.props
        const { title, persons, chatType } = data;
        return (
            <CoverageCell title={title} cars={persons} chatType={chatType} myProfile={profile} detail={this.detail.bind(this)} navigation={this.props.navigation} />
        )
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
