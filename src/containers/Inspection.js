/**
 * @flow
 * 巡检报表
 */
import React from 'react';
import { Button, InputItem, List } from '@ant-design/react-native';
// import Button from '@ant-design/react-native/lib/button';
import {
    ScrollView, Text
} from 'react-native';
import Toast from '@remobile/react-native-toast';

export default class Inspection extends React.Component {
    static navigationOptions = {    //上标题
        title: '巡检报表',
    };
    constructor(props) {
        super(props);
        //this._onChangeText = this._onChangeText.bind(this)
        this.state = {
            duty_person: "",
            inspection_person: "",
            create_date: Math.round(new Date().getTime() / 1000).toString(),
            calendar_data: Math.round(new Date().getTime() / 1000).toString(),
            state: "",
            maintenance: "",
            abnormal: "",
        }
    }
    //create_date:精确到时分秒 calendar_data：年月日即可       
    // _onChangeText(inputData){
    //   console.log("输入的内容",inputData);
    //   this.setState({showFirstValue:inputData})
    // }
    createInspection = () => {
        let url = "http://10.112.17.185:8100/api/v1/info/inspection"
        let formData = {}
        formData.duty_person = this.state.duty_person
        formData.inspection_person = this.state.inspection_person
        formData.create_date = this.state.create_date
        formData.calendar_date = this.state.calendar_data
        formData.state = this.state.state || ''
        formData.maintenance = this.state.maintenance || ''
        formData.abnormal = this.state.abnormal || ''
        formData.summary = this.state.summary || ''

        console.log(formData)
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/html',
            },
            dataType: "text",
            body: JSON.stringify(formData),
        }).then((res) => {
            if (res.status == '200') {
                res.json()
                    .then((json) => {
                        Toast.showShortCenter('提交成功！')
                        console.log(json)
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
        const { duty_person, inspection_person } = this.state;
        return (
            <ScrollView
                style={{ flex: 1 }}
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <List renderHeader={'添加信息'}>
                    <InputItem
                        clear
                        autoFocus={
              /* TODO: https://github.com/facebook/jest/issues/3707  */ typeof jest ===
                            'undefined'
                        }
                        placeholder='必填'
                        onChangeText={(duty_person) => this.setState({ duty_person })}
                    >
                        值班人
          </InputItem>
                    <InputItem
                        clear
                        autoFocus={
              /* TODO: https://github.com/facebook/jest/issues/3707  */ typeof jest ===
                            'undefined'
                        }
                        placeholder='必填'
                        onChangeText={(inspection_person) => this.setState({ inspection_person })}

                    >
                        巡检人员
          </InputItem>
                    <InputItem
                        clear
                        autoFocus={
              /* TODO: https://github.com/facebook/jest/issues/3707  */ typeof jest ===
                            'undefined'
                        }
                        onChangeText={(state) => this.setState({ state })}
                    >
                        巡检总况
          </InputItem>
                    <InputItem
                        clear
                        autoFocus={
              /* TODO: https://github.com/facebook/jest/issues/3707  */ typeof jest ===
                            'undefined'
                        }
                        onChangeText={(maintenance) => this.setState({ maintenance })}
                    >
                        维护信息
          </InputItem>
                    <InputItem
                        clear
                        autoFocus={
              /* TODO: https://github.com/facebook/jest/issues/3707  */ typeof jest ===
                            'undefined'
                        }
                        onChangeText={(abnormal) => this.setState({ abnormal })}
                    >
                        异常项
          </InputItem>
                    <InputItem
                        clear
                        autoFocus={
              /* TODO: https://github.com/facebook/jest/issues/3707  */ typeof jest ===
                            'undefined'
                        }
                        onChangeText={(summary) => this.setState({ summary })}
                    >
                        总结
          </InputItem>

                    <Button
                        disabled={!duty_person || !inspection_person}
                        onPress={this.createInspection}
                        type="primary"
                    >
                        确定提交
            </Button>

                </List>

            </ScrollView >
        );
    }
}