/**
 * @flow
 *
 * 我的页面
 */
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import CoverageCell from '../components/coverageCell';
import { getMetaData } from '../api/index';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loginActions } from '../actions/index'

class AboutMyScreen extends React.Component {
   
    render() {
    const { profile } = this.props
    
        return (

            <View style={styles.container}>
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
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Inspection')}
                    >
                <View style={styles.setting}>
                    <View style={{ height: 20, width: 20}}>
                        <Icon name="md-clipboard" size={20} color='#0A60FE'/>
                    </View>
                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 16, color: 'rgb(143,163,174)' }}>巡检</Text>
                    </View>
                </View>
                </TouchableOpacity>
                
                <View style={styles.setting}>
                    <View style={{ height: 20, width: 20}}>
                        <Icon name="ios-pin" size={20} color='#0A60FE'/>
                    </View>
                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 16, color: 'rgb(143,163,174)' }}>定位</Text>
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
        
        backgroundColor: '#ffffff',
    },
    setting: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems:'center',
        backgroundColor: '#ffffff',

        height: 40,
        paddingHorizontal: 25,
        paddingVertical: 10
    },



});


function mapStateToProps(state) {
    return {
        profile: state.chat.profile
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...loginActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutMyScreen)


//export default AboutMyScreen;