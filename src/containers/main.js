/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * 暂时废除理由：此页应该改为消息列表页
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, ListView, Image } from 'react-native';
import CoverageCell from '../components/coverageCell';
import { getMetaData, genToken } from '../api/index';
import './setUserAgent.js'
//import io from '../utils/socket.io/socket.io';
import CountEmitter from '../event/countEmitter'
import { chatActions,loginActions,locationActions} from '../actions/index'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

//socket-clientv2.1.1不能用，报server error，原因待解决
//import io from 'socket.io-client'


var _this = null;
var token1 = '';
var token2 = '';

_this = {
  data: {
    myId: 0,
    myName: "",
    myUserName: "",
    myself: {},
    users: [],
    groups: [],
    userMap: {},
    groupMap: {},
    groupIds: "",
    socket: null,
    url: ""
  }
}

init()

function init() {
  // @TODO 用的模拟数据。fetch数据需要先登陆
  // result:元数据
  var result = getMetaData('/profile/getMetaData')
  _this.data.myId = result.data.myId;
  _this.data.myName = result.data.myName;
  _this.data.myUserName = result.data.myUserName;
  _this.data.myself = result.data.userMap[result.data.myId];
  _this.data.users = result.data.users;
  _this.data.groups = result.data.groups;
  _this.data.userMap = result.data.userMap;
  _this.data.groupMap = result.data.groupMap;
  _this.data.groupIds = result.data.groupIds;
  _this.data.url = result.data.url;

  initConnect(result.data.url)
}

function initConnect(url) {
  console.log('Connect to ' + url)
  var result = genToken('/profile/genToken')
  token1 = result.token1
  token2 = result.token2
}

// CoverageArrs:处理后传入组件的数据
var CoverageArrs = [{
  title: 'Friends', persons: _this.data.users, chatType: 'user'
}, {
  title: 'Groups', persons: _this.data.groups, chatType: 'group'
}]

class MainContainer extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(CoverageArrs),
    };
  }

  componentDidMount() {
    const { actions } = this.props
    var authString = JSON.stringify({
      id: _this.data.myId,
      name: _this.data.myName,
      token1: token1,
      token2: token2
    })
    actions.connectChat(authString) // redux管理聊天socket连接
    actions.connectLocation() // redux管理定位信息socket连接
    actions.setMyProfile(_this.data.myself) // redux管理全局用户信息
  }

  componentWillMount() {
    CountEmitter.addListener('notifyConversationListRefresh', () => {
      console.log('重新加载会话')
      this.loadConversations(this.state.username)
    })
  }

  loadConversations(username) {
    // ConversationUtil.getConversations(username, (result) => {
    //     let count = result.length
    //     //@TODO 传递给state，用flatlist组件渲染
    //     //this.setState({recentConversation:result})
    // })
  }

  detail(title) {
  }

  renderMover(data) {
    const { title, persons, chatType } = data;
    return (
      <CoverageCell title={title} cars={persons} chatType={chatType} userMap={_this.data.userMap} myProfile={_this.data.myself} detail={this.detail.bind(this)} navigation={this.props.navigation} />
    )
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
    chat: state.chat
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...chatActions,...loginActions,...locationActions}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer)

const styles = StyleSheet.create({
  chatlist: {
    backgroundColor: '#f2f2f2',
    height: 800
  }
});
