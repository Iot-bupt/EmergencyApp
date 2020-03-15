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
import Toast from '@remobile/react-native-toast'
import { SERVER_POST } from '../const'

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
        // let url = SERVER_POST + '/api/v1/user/user?Id=' + id
        // fetch(url, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'text/html',
        //     }
        // }).then((res) => {
        //     if (res.status == '200') {
        //         res.json()
        //             .then((json) => {
            var _test= [
                {
                    "id": 201,
                    "name": "sumory.wu",
                },
                {
                    "id": 202,
                    "name": "felix",
                },
                {
                    "id": 203,
                    "name": "sunny",
                },
                {
                    "id": 205,
                    "name": "bruce",
                },
                {
                    "id": 206,
                    "name": "bamzi",
                },
                {
                    "id": 207,
                    "name": "roy",
                }
            ]
                        CoverageArrs[0].persons = _test
                        // fix:两个异步请求后分别setstate，会导致点击无法收缩展开
                        /* 解决方法：在一个请求成功后再请求第二个，强制给两个异步请求排序
                        * 缺点：耦合性太强
                        * this.getGroupsInfo(id)
                        */
                        this.getGroupsInfo(id)
        //             })
        //     } else {
        //         Toast.showShortCenter('API Error: 获取单聊联系人列表失败')
        //     }
        // }).catch((error) => {
        //     console.error("error")
        //     console.error(error)
        // })
    }

    getGroupsInfo = (id) => {
        // let url = SERVER_POST + '/api/v1/user/groupByUserId?userId=' + id
        // fetch(url).then((res) => {
        //     if (res.status == '200') {
        //         res.json()
        //             .then((json) => {
                        var groupData=[{
                            "id": 160,
                            "name": "巡检人员oncall群"
                        },
                        {
                            "id": 180,
                            "name": "智能巡检效率沟通群"
                        },
                        {
                            "id": 190,
                            "name": "应急指挥群"
                        }]
                        CoverageArrs[1].persons = groupData
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(CoverageArrs),
                        });
        //             })
        //     } else {
        //         Toast.showShortCenter('API Error: 获取群聊联系人列表失败')
        //     }
        // }).catch((error) => {
        //     console.error("error")
        //     console.error(error)
        // })
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
