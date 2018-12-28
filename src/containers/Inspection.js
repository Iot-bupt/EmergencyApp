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

export default class Inspection extends React.Component {
    static navigationOptions = {    //上标题
        title: '巡检报表',
    };
    constructor(props) {
      super(props);
      this.state = {
       
      };
    }
   
    render() {
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
          >
            值班人
          </InputItem>
          <InputItem
            clear
            autoFocus={
              /* TODO: https://github.com/facebook/jest/issues/3707  */ typeof jest ===
              'undefined'
            }
          >
            巡检人员
          </InputItem>
          <InputItem
            clear
            autoFocus={
              /* TODO: https://github.com/facebook/jest/issues/3707  */ typeof jest ===
              'undefined'
            }
          >
            巡检总况
          </InputItem>
          <InputItem
            clear
            autoFocus={
              /* TODO: https://github.com/facebook/jest/issues/3707  */ typeof jest ===
              'undefined'
            }
          >
            内容总结
          </InputItem>
          <InputItem
            clear
            autoFocus={
              /* TODO: https://github.com/facebook/jest/issues/3707  */ typeof jest ===
              'undefined'
            }
          >
            维护信息
          </InputItem>
          <InputItem
            clear
            autoFocus={
              /* TODO: https://github.com/facebook/jest/issues/3707  */ typeof jest ===
              'undefined'
            }
          >
            异常项
          </InputItem>
  
        </List>
        
      </ScrollView>
      );
    }
  }
  