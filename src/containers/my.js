/**
 * @flow
 *
 * 我的页面
 */


import React from 'react';
import { StyleSheet, View, Text, ListView, Image } from 'react-native';
import CoverageCell from '../components/coverageCell';
import { getMetaData } from '../api/index';

class AboutMyScreen extends React.Component {
    render() {
        return (

            <View style={styles.container}>

                <View style={styles.profile}>
                    <View style={{ height: 100, margin: 10, flex: 1, flexDirection: 'row' }}>
                        <Image style={{ height: 70, width: 70, borderRadius: 35, backgroundColor: '#dcdcdc', paddingVertical: 3 }} source={require('../image/user2-128x128.jpg')} />
                        <View style={{ flex: 1, marginHorizontal: 15, paddingTop: 5, justifyContent: 'space-around' }}>
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#cccccc' }}>mary</Text>
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


            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        paddingTop: 20,
    },
    profile: {
        height: 100,
        //borderColor: '#cccccc',
        //borderWidth: 1,
        backgroundColor: '#ffffff',
    },
});

export default AboutMyScreen;