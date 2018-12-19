import React, { Component } from 'react'
import { Dimensions, StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native'
import CountEmitter from '../event/countEmitter';
import TimeUtils from '../utils/TimeUtil'
import { chatActions } from '../actions/index'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Icon from "react-native-vector-icons/Ionicons";
import ImagePicker from 'react-native-image-crop-picker';
import MoreView from '../components/moreView';

const { width } = Dimensions.get('window')

class SingleChatroomPage extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('showName', 'unknown'),
    });

    constructor(props) {
        super(props);
        this.state = {
            inputMsg: '',
            messages: [],
            showMoreView: false
        };
        this.sendTextMessage = this.sendTextMessage.bind(this)
        this.sendImageMessage = this.sendImageMessage.bind(this)
        this.handlePress = this.handlePress.bind(this)
        //路由跳转时携带的参数
        this.myProfile = this.props.navigation.getParam('myProfile', {}) //@param myProfile:个人信息
        this.chatType = this.props.navigation.getParam('chatType', 'unknown') //@param chatType:聊天类型
        this.chatWithId = this.props.navigation.getParam('chatWithId', 0)  //@param chatWithId:聊天对象Id
        this.showName = this.props.navigation.getParam('showName', 'unknown') //@param showName:聊天对象名
    }

    render() {
        const { chat } = this.props
        const chatWithId = this.props.navigation.getParam('chatWithId', 0)  //@param chatWithId:聊天对象Id

        //Redux统一管理聊天信息。所以在每个聊天页面都需要整理出当前聊天对象的信息
        var mychatMessages = []
        chat.messages.map(function (msg, index) {
            if (msg.msgType === 0) { //判断是单聊
                if (msg.fromId === chatWithId || msg.toUserId === chatWithId) { //判断接收&发送的消息是当前聊天对象
                    mychatMessages.push(msg)
                }
            }
        })

        //工具栏
        var moreView = []
        if (this.state.showMoreView) {
            moreView.push(
                <View key={"more-view-key"}>
                    <View style={{ width: width, height: 1, backgroundColor: '#D3D3D3' }} />
                    <View style={{ height: 100 }}>
                        {/* @TODO 绑定逻辑 */}
                        <MoreView
                            sendImageMessage={this.sendImageMessage}
                        />
                    </View>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <FlatList
                    ref="flatList"
                    data={mychatMessages}
                    renderItem={this.renderItem}
                    keyExtractor={this._keyExtractor}
                    extraData={this.state}
                />
                <View style={styles.footer}>
                    <View style={styles.textInput}>
                        <View style={{ flex: 4, height: 40, borderStyle: 'solid', borderColor: 'rgb(203,205,208)', borderWidth: 1 }}>
                            <TextInput value={this.state.inputMsg} onChangeText={(inputMsg) => this.setState({ inputMsg })} />
                            {/* onChangeText监听TextInput组件值的变化，并与state绑定 */}
                        </View>
                        <View style={styles.sendBtn}>
                            <TouchableOpacity onPress={() => { this.sendTextMessage(this.myProfile.id, this.chatWithId) }}>
                                <Text style={{ color: 'white', height: 30, alignItems: 'center', lineHeight: 40 }} >发送</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => { this.handlePress() }}>
                            <Image style={[styles.icon, { marginLeft: 10 }]} source={require('../images/ic_chat_add.png')} />
                        </TouchableOpacity>
                    </View>
                    {moreView}
                </View>
            </View>
        )
    }
    //展示隐藏工具栏
    handlePress() {
        this.setState({ showMoreView: !this.state.showMoreView })
    }

    //发送图片
    sendImageMessage(image) {
        console.log("此处开始发送图片逻辑")
    }

    //发送socket
    sendTextMessage(fromUserId, toUserId) {
        if(this.state.inputMsg === ''){
            //@TODO 用toast插件替换
            console.log('输入不能为空')
            return
        }
        //向socket发送数据
        var msg = {
            type: 0, //1 广播，0 单播给指定target
            target: {
                id: toUserId
            },
            content: this.state.inputMsg
        };

        //通过Redux管理socket
        this.props.actions.sendMessage(JSON.stringify(msg))

        // this.concatMessage({
        //     createTime: TimeUtils.currentTime(),
        //     fromUserId: fromUserId,
        //     toUserId: toUserId,
        //     content: this.state.inputMsg
        // })
        this.props.actions.concatMessageWhenSend({
            createTime: TimeUtils.currentTime(),
            msgType: 0,
            fromUserId: fromUserId,
            toUserId: toUserId,
            content: this.state.inputMsg
        })

        // 清空TextInput
        this.setState({ inputMsg: '' })
    }

    //本函数已弃用。将本条消息添加到会话中
    concatMessage(message) {
        //@TODO 将本条消息添加到首页会话列表中
        // ConversationUtil.addMessage(message, () => {
        //     //通知首页会话列表页刷新会话
        //     CountEmitter.emit('notifyConversationListRefresh')
        // })

        //将本条消息添加到会话中,通过redux统一管理消息
        // let msgs = this.props.chat.messages
        // msgs.push(message)

        //将本条消息添加到会话中,state改变页面自动刷新
        let msgs = this.state.messages
        msgs.push(message)
        this.setState({ messages: msgs })
    }

    _keyExtractor = (item, index) => '#' + index

    //FlatList渲染消息
    renderItem = (item) => {
        //通过message中的fromUserId属性判断是发送还是接收
        if (item.item.fromUserId === this.myProfile.id) {
            return this.renderSendTextMsg(item)
        } else {
            return this.renderReceivedTextMsg(item)
        }
    }

    //FlatList渲染接受的文本消息
    renderReceivedTextMsg(item) {
        return (
            <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: 15, marginLeft: 10 }}>
                <Text style={listItemStyle.time}>{TimeUtils.formatChatTime(parseInt(item.item.createTime))}</Text>
                <View style={{ marginTop: 5, height: 40, borderRadius: 5, backgroundColor: 'rgb(140,204,223)', paddingHorizontal: 10 }}>
                    <Text style={{ lineHeight: 40 }}>{item.item.content}</Text>
                </View>
            </View>
        )
    }

    //FlatList渲染发送的文本消息
    renderSendTextMsg(item) {
        return (
            <View style={{ flexDirection: 'column', alignItems: 'flex-end', marginTop: 15, marginRight: 10 }}>
                <Text style={listItemStyle.time}>{TimeUtils.formatChatTime(parseInt(item.item.createTime))}</Text>
                <View style={{ marginTop: 5, height: 40, borderRadius: 5, backgroundColor: 'white', paddingHorizontal: 10 }}>
                    <Text style={{ lineHeight: 40 }}>{item.item.content}</Text>
                </View>
            </View>
        )
    }

};

function mapStateToProps(state) {
    return {
        chat: state.chat
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...chatActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleChatroomPage)


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    icon: {
        width: 30,
        height: 30,
    },
    textInput: {
        flex: 1,
        height: 40,
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    sendBtn: {
        flex: 0.8,
        height: 40,
        backgroundColor: 'rgb(80,140,184)',
        textAlign: 'center',
        alignItems: 'center'
    }
});

const listItemStyle = StyleSheet.create({
    time: {
        color: 'rgb(128,128,128)',
        fontSize: 13,
        fontWeight: 'normal'
    }
});