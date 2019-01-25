/**
 * @flow
 *
 * 我的页面
 */


import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Switch, Button } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import CoverageCell from '../components/coverageCell';
import { getLongitudeAndLatitude } from '../utils/LocationUtil';
import { getMetaData } from '../api/index';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loginActions, locationActions } from '../actions/index'
import StorageUtil from '../utils/StorageUtil'
import Toast from '@remobile/react-native-toast';

class AboutMyScreen extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        this.state = {
            locationSwitchIsOn: false
        }
    }

    LoginOut = () => {
        StorageUtil.set('hasLogin', { 'hasLogin': false })
        Toast.showShortCenter('注销成功，请重新登录！')
        this.props.navigation.navigate('Login', {})
    }

    render() {
        const { profile } = this.props
        if (this.state.locationSwitchIsOn) {
            console.log('Location switch on.')
            Toast.showShortCenter('开始上传定位信息')
            this.timer = setInterval(
                () => {
                    getLongitudeAndLatitude().then((locationArr) => {
                        this.props.actions.sendLocationMessage(profile.id, profile.name, locationArr)
                    })
                },//延时操作
                5000       //延时时间
            );
        } else {
            console.log('Location switch off.')
            clearTimeout(this.timer)
        }

        return (

            <View style={styles.container}>
                <View>
                    <View style={styles.profile}>
                        <View style={{ height: 100, margin: 10, flex: 1, flexDirection: 'row' }}>
                            <Image style={{ height: 70, width: 70, borderRadius: 35, backgroundColor: '#dcdcdc', paddingVertical: 3 }} source={require('../images/user2-128x128.jpg')} />
                            <View style={{ flex: 1, marginHorizontal: 15, paddingTop: 5, justifyContent: 'space-around' }}>
                                <View>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#cccccc' }}>{profile.name}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ backgroundColor: '#1EA114', borderRadius: 7, height: 14, width: 14 }}>
                                    </View>
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ fontSize: 18, color: '#cccccc' }}>Online</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Inspection')}>
                        <View style={styles.setting}>
                            <View style={styles.settingItem}>
                                <View style={{ height: 20, width: 20 }}>
                                    <Icon name="md-clipboard" size={20} color='#0A60FE' />
                                </View>
                                <View style={{ marginHorizontal: 10 }}>
                                    <Text style={{ fontSize: 16, color: 'rgb(143,163,174)' }}>巡检报告</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.setting}>
                        <View style={styles.settingItem}>
                            <View style={{ height: 20, width: 20 }}>
                                <Icon name="ios-pin" size={20} color='#0A60FE' />
                            </View>
                            <View style={{ marginHorizontal: 10 }}>
                                <Text style={{ fontSize: 16, color: 'rgb(143,163,174)' }}>上传定位信息</Text>
                            </View>
                        </View>
                        <View>
                            <Switch
                                onValueChange={(value) => this.setState({ locationSwitchIsOn: value })}
                                style={{ marginBottom: 10, marginTop: 10 }}
                                value={this.state.locationSwitchIsOn} />
                        </View>
                    </View>
                </View>
                <View style={{ marginBottom: 20 }}>
                    <Button title='退出登录' onPress={() => { this.LoginOut() }} />
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 20,
    },
    profile: {
        height: 100,
        //borderColor: '#cccccc',
        //borderWidth: 1,
        backgroundColor: '#ffffff',
    },
    setting: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',//好友列表全部
        height: 40,
        paddingHorizontal: 25,
        paddingVertical: 10
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
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
        actions: bindActionCreators({ ...loginActions, ...locationActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutMyScreen)


//export default AboutMyScreen;