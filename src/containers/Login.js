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
// import request from '../utils/request';
// import navigationUtil from '../utils/navigation';
// import { saveToken } from '../utils/storage';

class Login extends Component {
    state = {};

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
                    onPress={this.login}
                >登录</Button>
                {/* <View style={styles.textBtnContainer}>
          <TextButton
            onPress={() => navigation.navigate('Register')}
          >新用户注册</TextButton>
          <TextButton>忘记密码？</TextButton>
        </View> */}
            </View>
        );
    }

    login = () => {
        const { username, password } = this.state;
        let url = 'http://10.112.17.185:8086/api/v1/info/login' //实验室服务器
        // let formData = new FormData();
        // formData.append('username', username);
        // formData.append('password', password);
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
                console.log(json)
                if (json) {
                    if (json.error) {
                        Toast.showShortCenter('用户名或密码错误！')
                    } else {
                        
                        // 登录成功后跳转页面
                        this.props.navigation.navigate('Home', {})
                    }
                } else {
                    Toast.showShortCenter('登录失败')
                }

            }).catch((e) => {
                Toast.showShortCenter('网络请求出错：' + e)
            });
    };
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