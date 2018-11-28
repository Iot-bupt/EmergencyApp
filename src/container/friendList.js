/**
 *
 * @flow
 *
 * 好友列表
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, Button } from 'react-native'
import Icon from "react-native-vector-icons/Ionicons";






class FriendListScreen extends React.Component {

    render() {
        return (
            <View style={{ flex: 1 }}>

                <View style={styles.chatItem}>
                    <View style={{ height: 20, width: 20}}>
                        <Icon name="md-people" size={20} color='rgb(222,87,66)'/>
                    </View>
                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 16, color: 'rgb(143,163,174)' }}>IM讨论小组</Text>
                    </View>
                </View>
                <View style={styles.chatItem}>
                    <View style={{ height: 20, width: 20}}>
                        <Icon name="md-people" size={20} color='rgb(222,87,66)'/>
                    </View>
                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 16, color: 'rgb(143,163,174)' }}>Gru使用讨论</Text>
                    </View>
                </View>
                <View style={styles.chatItem}>
                    <View style={{ height: 20, width: 20}}>
                        <Icon name="md-people" size={20} color='rgb(222,87,66)'/>
                    </View>
                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 16, color: 'rgb(143,163,174)' }}>测试群组</Text>
                    </View>
                </View>


                <View style={styles.chatItem}>
                    <View style={{ height: 20, width: 20}}>
                        <Icon name="md-person" size={20} color='rgb(222,87,66)'/>
                    </View>
                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 16, color: 'rgb(143,163,174)' }}>sumory.wu</Text>
                    </View>
                </View>
                <View style={styles.chatItem}>
                    <View style={{ height: 20, width: 20}}>
                        <Icon name="md-person" size={20} color='rgb(222,87,66)'/>
                    </View>
                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 16, color: 'rgb(143,163,174)' }}>felix</Text>
                    </View>
                </View>
                <View style={styles.chatItem}>
                    <View style={{ height: 20, width: 20}}>
                        <Icon name="md-person" size={20} color='rgb(222,87,66)'/>
                    </View>
                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 16, color: 'rgb(143,163,174)' }}>sunny</Text>
                    </View>
                </View>
                <View style={styles.chatItem}>
                    <View style={{ height: 20, width: 20}}>
                        <Icon name="md-person" size={20} color='rgb(222,87,66)'/>
                    </View>
                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 16, color: 'rgb(143,163,174)' }}>bruce</Text>
                    </View>
                </View>
                <View style={styles.chatItem}>
                    <View style={{ height: 20, width: 20}}>
                        <Icon name="md-person" size={20} color='rgb(222,87,66)'/>
                    </View>
                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 16, color: 'rgb(143,163,174)' }}>bamzi</Text>
                    </View>
                </View>
                <View style={styles.chatItem}>
                    <View style={{ height: 20, width: 20}}>
                        <Icon name="md-person" size={20} color='rgb(222,87,66)'/>
                    </View>
                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 16, color: 'rgb(143,163,174)' }}>roy</Text>
                    </View>
                </View>


            </View>
        );
    }
}


const styles = StyleSheet.create({
    chatBlock: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        paddingHorizontal: 25,
        paddingVertical: 20,
        height: 60,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc'

    },
    tip: {
        height: 20,
        width: 20,
        backgroundColor: 'rgb(205,85,66)',
        borderRadius: 5
    },
    tipText: {
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    chatItem: {
        flexDirection: 'row',
        alignItems:'center',
        backgroundColor: '#ffffff',//好友列表全部
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        height: 50,
        paddingHorizontal: 25,
        paddingVertical: 10
    }
});

export default FriendListScreen;