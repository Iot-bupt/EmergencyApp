import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const APSLButton = require('apsl-react-native-button');

export default class Button extends Component {
  render() {
    const { style, textStyle, children } = this.props;
    return (
      <View style={ styles.navbar }>
        <Text style={ styles.text }>智能巡检客户端</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navbar: {
    width: '100%',
    height: 50,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '500',
  },
});