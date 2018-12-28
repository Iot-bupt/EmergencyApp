import React, { Component } from 'react';
import ImagePicker from 'react-native-image-crop-picker';

import { Dimensions, Image, PixelRatio, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';

const { width } = Dimensions.get('window');

const icons = [
    require('../images/ic_more_gallery.png'),
    require('../images/ic_more_camera.png'),
    require('../images/ic_more_folder.png'),
    require('../images/ic_more_movie.png'),
];

const iconTexts = [
    "相册", "拍摄", "文件", "视频通话"
];

export default class MoreView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var page = [];
        for (var i = 0; i < 1; i++) {
            var row = [];
            for (var j = 0; j < 4; j++) {
                row.push(
                    <Cell
                        key={"row" + i + "col" + j}
                        icon={icons[i * 4 + j]}
                        text={iconTexts[i * 4 + j]}
                        index={i * 4 + j}
                        sendImageMessage={this.props.sendImageMessage}
                        navigation={this.props.navigation}
                    />
                );
            }
            page.push(
                <View key={"page" + i} style={styles.rowContainer}>{row}</View>
            );
        }
        return (
            <View style={styles.moreViewContainer}>
                {page}
            </View>
        );
    }
}

class Cell extends Component {
    render() {
        return (
            <TouchableOpacity style={styles.cellContainer} activeOpacity={0.6} onPress={() => this.handleClick()}>
                <View style={styles.cellContainer}>
                    <View style={styles.cellImgContainer}>
                        <Image style={styles.cellImage} source={this.props.icon} />
                    </View>
                    <Text numberOfLines={1} style={styles.cellText}>{this.props.text}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    handleClick() {
        let index = this.props.index;
        switch (index) {
            case 0:
                this.chooseImage();
                break;
            case 3:
                this.toVideoChat();
            default:
        }
    }

    chooseImage() { // 从相册中选择图片发送
        ImagePicker.openPicker({
            cropping: false
        }).then(image => {
            if (this.props.sendImageMessage) {
                console.log(this.props.sendImageMessage)
                let path = image.path;
                this.props.sendImageMessage(image);
            }
        });
    }

    toVideoChat() { // 路由到视频聊天页面
        this.props.navigation.navigate('VideoChat', {})
    }
}

const styles = StyleSheet.create({
    moreViewContainer: {
        width: width,
        height: 100,
        flexDirection: 'column',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#F4F4F4'
    },
    rowContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        height: 100 / 2 - 20,
    },
    cellContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
    },
    cellImgContainer: {
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FBFBFB',
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#DFDFDF',
        borderRadius: 10,
    },
    cellImage: {
        width: 35,
        height: 35,
    },
    cellText: {
        fontSize: 12,
        width: 55,
        textAlign: 'center'
    }
});
