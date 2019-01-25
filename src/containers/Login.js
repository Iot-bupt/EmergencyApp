import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Alert
} from 'react-native';

import Button from '../components/Button';
import TextButton from '../components/TextButton';
import TextField from '../components/TextField';
import Toast from '@remobile/react-native-toast';
import StorageUtil from '../utils/StorageUtil';

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: ''
        };

        StorageUtil.get('username', (error, object) => {
            if (!error && object && object.username) {
                this.setState({ username: object.username });
                // @TODO 获取一些userinfo
            }
        });
    }

    render() {
        const { navigation } = this.props;
        const { username, password } = this.state;
        return (
            <View style={styles.container}>
                <TextField
                    label='账号'
                    placeholder='用户名'
                    onChange={value => this.setState({ username: value })}
                />
                <TextField
                    label='密码'
                    type='password'
                    placeholder='请输入登录密码'
                    onChange={value => this.setState({ password: value })}
                />
                <Button
                    isDisabled={!username || !password}
                    onPress={this.manualLogin}
                >登录</Button>
                {/* fix bug：此处不可以写成onPress={this.manualLogin()}
                    否则每次this.state修改都会调用这个函数
                    原因：给一个标签绑定onPress事件的时候，在方法里this不指向组件，而是这个标签
                    ()=>{}这种形式的代码，语法规定就是(function(){}).bind(this),即自动添加了bind this
                    为啥？？？
                         */}
            </View>
        );
    }

    login = (username, password) => {
        // console.log(username, password)
        if (!username || !password) {
            return
        }
        let url = 'http://39.104.189.84:30300/api/v1/user/login' //实验室服务器
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
            .then((res) => res.json())
            .then((json) => {
                if (json) {
                    if (json.error) {
                        Toast.showShortCenter('用户名或密码错误！')
                    } else {
                        // 登录账户信息持久化
                        StorageUtil.set('hasLogin', { 'hasLogin': true });
                        StorageUtil.set('username', { 'username': username });
                        StorageUtil.set('password', { 'password': password });
                        // 登录成功后跳转页面
                        // userid传递给主页进行处理
                        this.props.navigation.navigate('Home', { userid: json.user_id })
                    }
                } else {
                    Toast.showShortCenter('登录失败')
                }

            }).catch((e) => {
                Toast.showShortCenter('网络请求出错：' + e)
            });
    };

    manualLogin = () => {
        // console.log('manualLogin')
        const { username, password } = this.state
        this.login(username, password)
    }

    autoLogin = () => {
        // console.log('autologin')
        var username, password
        StorageUtil.get('username', (error, object) => {
            if (!error && object && object.username) {
                username = object.username
                // console.log(username)
                StorageUtil.get('password', (error, object) => {
                    if (!error && object && object.password) {
                        password = object.password
                        // console.log(username,password)
                        this.login(username, password)
                    } else {
                        Toast.showShortCenter('数据异常,请登录！');
                    }
                });
            } else {
                Toast.showShortCenter('数据异常，请登录！');
            }
        })
    };

    componentDidMount() {
        let username = ''
        let password = ''
        StorageUtil.get('hasLogin', (error, object) => {
            if (!error && object != null && object.hasLogin) {
                Toast.showShortCenter('自动登录中...')
                // console.log('自动登录')
                this.autoLogin()
            } else {
                // console.log('手动登录')
                return
            }
        })
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#fff'
    },
    textBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default Login;