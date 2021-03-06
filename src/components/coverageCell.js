import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Icon from "react-native-vector-icons/Ionicons";

export default class CoverageCell extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShow: false,
        };
    }

    detail = (title) => {
        this.setState({
            isShow: !this.state.isShow
        });
        this.props.detail(title);
    }

    static defaultProps = {
        title: '',
        cars: []
    }

    /** for是ES5语法，而且此方法无法获得每一行的索引
     * 故改用map */

    // isShowText() {
    //     const { title, cars } = this.props
    //     var allChild = []
    //     for (var i = 0; i < cars.length; i++) {
    //         allChild.push(
    //             <TouchableOpacity onPress={() =>
    //                 this.props.navigation.navigate('Chatroom', {
    //                     name: i,
    //                 })
    //             }>
    //                 <View style={styles.chatItem}>
    //                     <View style={{ height: 20, width: 20, backgroundColor: 'red' }}></View>
    //                     <View style={{ marginHorizontal: 10 }}>
    //                         <Text style={{ fontSize: 20, color: 'rgb(143,163,174)' }}>{cars[i].name}</Text>
    //                     </View>
    //                 </View>
    //             </TouchableOpacity>
    //         )
    //     }
    //     return allChild
    // }

    render() {
        const { title, cars, chatType, myProfile } = this.props
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => { this.detail(title) }}>
                    <View style={styles.chatBlock}>
                        <View style={{ height: 20, width: 20 }}>
                            <Icon name="md-people" size={20} color='rgb(173,185,191)' />
                        </View>
                        <View style={{ marginHorizontal: 10, flex: 3 }}>
                            <Text style={{ fontSize: 20, color: 'rgb(173,185,191)' }}>{title}</Text>
                        </View>
                        {/* <View style={styles.tip}>
                            <Text style={styles.tipText}>3</Text>
                        </View> */}
                    </View>
                </TouchableOpacity>
                {/* {this.state.isShow ? <View>{this.isShowText()}</View> : <View></View>} */}
                {this.state.isShow ? <View>{
                    cars.map((car, index) =>
                        <TouchableOpacity key={index} onPress={() => {
                            if (chatType === 'user') {
                                this.props.navigation.navigate('SingleChatroom', {
                                    chatType: chatType,
                                    chatWithId: cars[index].id,
                                    showName: cars[index].name,
                                    myProfile: myProfile,
                                })
                            } else if (chatType === 'group') {
                                this.props.navigation.navigate('PublicChatroom', {
                                    chatType: chatType,
                                    chatWithId: cars[index].id,
                                    showName: cars[index].name,
                                    myProfile: myProfile,
                                })
                            }
                        }
                        }>
                            <View style={styles.chatItem}>
                                <View style={{ height: 20, width: 20 }}>
                                    <Icon name="md-radio-button-off" size={20} color='rgb(222,87,66)' />
                                </View>
                                <View style={{ marginHorizontal: 10 }}>
                                    <Text style={{ fontSize: 20, color: 'rgb(143,163,174)' }}>{cars[index].name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                }
                </View> : <View></View>}
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
        borderBottomColor: '#cccccc',
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
        alignItems: 'center',
        backgroundColor: '#ffffff', //好友列表全部
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        height: 50,
        paddingHorizontal: 25,
        paddingVertical: 10
    }
});
