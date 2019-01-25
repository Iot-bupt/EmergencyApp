import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  ListView,
  Platform,
  Button
} from 'react-native';
import io from '../utils/socket.io/socket.io'; // 旧版socket依赖
import {
  RTCPeerConnection,
  RTCMediaStream,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStreamTrack,
  getUserMedia,
} from 'react-native-webrtc';

// 经测试，stun服务器是必须的。否则会在A加入B的聊天室时报错'Can't find variable:configuration'
//const configuration = { "iceServers": [{ "url": "stun:stun.ideasip.com" }] }; // 可用的国内服务器
const configuration = { "iceServers": [{ "url": "stun:39.104.189.84:3478" }] }; // 实验室服务器

const pcPeers = {};
let localStream;

function getLocalStream(isFront, callback) {

  let videoSourceId;

  // on android, you don't have to specify sourceId manually, just use facingMode
  // uncomment it if you want to specify
  if (Platform.OS === 'ios') {
    MediaStreamTrack.getSources(sourceInfos => {
      console.log("sourceInfos: ", sourceInfos);

      for (const i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
          videoSourceId = sourceInfo.id;
        }
      }
    });
  }

  getUserMedia({
    audio: true,
    video: {
      mandatory: {
        minWidth: 640, // Provide your own width, height and frame rate here
        minHeight: 360,
        minFrameRate: 30,
      },
      facingMode: (isFront ? "user" : "environment"),
      optional: (videoSourceId ? [{ sourceId: videoSourceId }] : []),
    }
  }, function (stream) {
    console.log('getUserMedia success', stream);
    callback(stream);
  }, logError);
}

function mapHash(hash, func) {
  const array = [];
  for (const key in hash) {
    const obj = hash[key];
    array.push(func(obj, key));
  }
  return array;
}

function logError(error) {
  console.log("logError", error);
}

let container;


export default class videochat extends Component {
  static navigationOptions = () => ({
    header: null // 隐藏标题栏：config must be a React component or null.
  });

  constructor(props) {
    super(props)

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => true });
    this.state = {
      info: '连接中...',
      status: 'init',
      roomID: '',
      isFront: false,
      selfViewSrc: null,
      remoteList: {},
      textRoomConnected: false,
      textRoomData: [],
      textRoomValue: '',
      socket: {}
    }

    this._press = this._press.bind(this)
    this._switchVideoType = this._switchVideoType.bind(this)
    this.receiveTextData = this.receiveTextData.bind(this)
    this._textRoomPress = this._textRoomPress.bind(this)
    this._renderTextRoom = this._renderTextRoom.bind(this)
  }


  componentDidMount() {

    container = this

    // const socket = io.connect('https://react-native-webrtc.herokuapp.com', { transports: ['websocket'] });  // 原项目信令服务器
    const socket = io.connect('http://39.104.189.84:30200', { transports: ['websocket'] }); // 实验室服务器java后台

    // @TODO bug：收到多次连接广播
    socket.connect()

    this.setState({ socket })

    socket.on('exchange', (data) => {
      this.exchange(data);
    });
    socket.on('leave', (socketId) => {
      this.leave(socketId);
    });
    socket.on('connect', function (data) {
      console.log('webrtc-socket connect');
      getLocalStream(true, function (stream) {
        localStream = stream;
        container.setState({ selfViewSrc: stream.toURL() });
        container.setState({ status: 'ready', info: 'Please enter or create room ID' });
      });
    });

    socket.on('disconnect', function (data) {
      console.log('disconnect', data)
    })
  }



  // 创建或加入房间
  join = (roomID) => { // ES6箭头函数直接实现bind
    let socket = this.state.socket
    socket.emit('join', roomID, (res) => {
      var socketIds = res.data
      //var socketIds = res
      console.log('join', socketIds);
      for (const i in socketIds) {
        const socketId = socketIds[i];
        //console.log(socketId)
        this.createPC(socketId, true);
      }
    });
  }

  createPC = (socketId, isOffer) => {
    const pc = new RTCPeerConnection(configuration);
    let socket = this.state.socket
    pcPeers[socketId] = pc;

    pc.onicecandidate = function (event) {
      console.log('onicecandidate', event.candidate);
      if (event.candidate) {
        socket.emit('exchange', JSON.stringify({ 'to': socketId, 'candidate': event.candidate }));
      }
    };

    function createOffer() {
      pc.createOffer(function (desc) {
        console.log('createOffer', desc);
        pc.setLocalDescription(desc, function () {
          console.log('setLocalDescription', pc.localDescription);
          socket.emit('exchange', JSON.stringify({ 'to': socketId, 'sdp': pc.localDescription }));
        }, logError);
      }, logError);
    }

    pc.onnegotiationneeded = function () {
      console.log('onnegotiationneeded');
      if (isOffer) {
        createOffer();
      }
    }

    pc.oniceconnectionstatechange = function (event) {
      console.log('oniceconnectionstatechange', event.target.iceConnectionState);
      if (event.target.iceConnectionState === 'completed') {
        setTimeout(() => {
          this.getStats();
        }, 1000);
      }
      if (event.target.iceConnectionState === 'connected') {
        createDataChannel();
      }
    };
    pc.onsignalingstatechange = function (event) {
      console.log('onsignalingstatechange', event.target.signalingState);
    };

    pc.onaddstream = function (event) {
      console.log('onaddstream', event.stream);
      container.setState({ info: 'One peer join!' });

      const remoteList = container.state.remoteList;
      remoteList[socketId] = event.stream.toURL();
      console.log(666)
      console.log(event.stream.toURL())
      container.setState({ remoteList: remoteList });
    };
    pc.onremovestream = function (event) {
      console.log('onremovestream', event.stream);
    };

    pc.addStream(localStream);
    function createDataChannel() {
      if (pc.textDataChannel) {
        return;
      }
      const dataChannel = pc.createDataChannel("text");

      dataChannel.onerror = function (error) {
        console.log("dataChannel.onerror", error);
      };

      dataChannel.onmessage = function (event) {
        console.log("dataChannel.onmessage:", event.data);
        container.receiveTextData({ user: socketId, message: event.data });
      };

      dataChannel.onopen = function () {
        console.log('dataChannel.onopen');
        container.setState({ textRoomConnected: true });
      };

      dataChannel.onclose = function () {
        console.log("dataChannel.onclose");
      };

      pc.textDataChannel = dataChannel;
    }
    return pc;
  }

  exchange = (data) => {
    const fromId = data.from;
    let socket = this.state.socket

    console.log('fromId', fromId)
    let pc;
    if (fromId in pcPeers) {
      pc = pcPeers[fromId];
    } else {
      pc = this.createPC(fromId, false);
    }

    if (data.sdp) {
      console.log('exchange sdp', data);
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
        if (pc.remoteDescription.type == "offer")
          pc.createAnswer(function (desc) {
            console.log('createAnswer', desc);
            pc.setLocalDescription(desc, () => {
              // console.log('setLocalDescription', pc.localDescription);
              socket.emit('exchange', JSON.stringify({ 'to': fromId, 'sdp': pc.localDescription }));
            }, logError);
          }, logError);
      }, logError);
    } else {
      console.log('exchange candidate', data);
      pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  }

  leave = (socketId) => {
    console.log('leave', socketId);
    const pc = pcPeers[socketId];
    const viewIndex = pc.viewIndex;
    pc.close();
    delete pcPeers[socketId];

    const remoteList = container.state.remoteList;
    delete remoteList[socketId]
    container.setState({ remoteList: remoteList });
    container.setState({ info: 'One peer leave!' });
  }

  getStats = () => {
    const pc = pcPeers[Object.keys(pcPeers)[0]];
    if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
      const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
      console.log('track', track);
      pc.getStats(track, function (report) {
        console.log('getStats report', report);
      }, logError);
    }
  }

  _press(event) {
    console.log(this.state.roomID)
    this.refs.roomID.blur();
    this.setState({ status: 'connect', info: 'Connecting' });
    this.join(this.state.roomID);
  }
  _switchVideoType() {
    const isFront = !this.state.isFront;
    this.setState({ isFront });
    getLocalStream(isFront, function (stream) {
      if (localStream) {
        for (const id in pcPeers) {
          const pc = pcPeers[id];
          pc && pc.removeStream(localStream);
        }
        localStream.release();
      }
      localStream = stream;
      container.setState({ selfViewSrc: stream.toURL() });

      for (const id in pcPeers) {
        const pc = pcPeers[id];
        pc && pc.addStream(localStream);
      }
    });
  }
  receiveTextData(data) {
    const textRoomData = this.state.textRoomData.slice();
    textRoomData.push(data);
    this.setState({ textRoomData, textRoomValue: '' });
  }
  _textRoomPress() {
    if (!this.state.textRoomValue) {
      return
    }
    const textRoomData = this.state.textRoomData.slice();
    textRoomData.push({ user: 'Me', message: this.state.textRoomValue });
    for (const key in pcPeers) {
      const pc = pcPeers[key];
      pc.textDataChannel.send(this.state.textRoomValue);
    }
    this.setState({ textRoomData, textRoomValue: '' });
  }
  _renderTextRoom() {
    return (
      <View style={styles.listViewContainer}>
        <ListView
          dataSource={this.ds.cloneWithRows(this.state.textRoomData)}
          renderRow={rowData => <Text>{`${rowData.user}: ${rowData.message}`}</Text>}
        />
        <TextInput
          style={{ width: 200, height: 30, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={value => this.setState({ textRoomValue: value })}
          value={this.state.textRoomValue}
        />
        <TouchableHighlight
          onPress={this._textRoomPress}>
          <Text>Send</Text>
        </TouchableHighlight>
      </View>
    );
  }

  goBackToLastPage = () => {

    this.state.socket.close()
    console.log(this.state.socket)
    this.props.navigation.goBack()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {this.state.info}
        </Text>
        {this.state.textRoomConnected && this._renderTextRoom()}
        <View style={{ flexDirection: 'row' }}>
          <Text>
            {this.state.isFront ? "Use front camera" : "Use back camera"}
          </Text>
          <TouchableHighlight
            style={{ borderWidth: 1, borderColor: 'black' }}
            onPress={this._switchVideoType}>
            <Text>Switch camera</Text>
          </TouchableHighlight>
        </View>
        {this.state.status == 'ready' ?
          (<View>
            <TextInput
              ref='roomID'
              autoCorrect={false}
              style={{ width: 200, height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={(text) => this.setState({ roomID: text })}
              value={this.state.roomID}
            />
            <TouchableHighlight
              onPress={this._press}>
              <Text>Enter room</Text>
            </TouchableHighlight>
          </View>) : null
        }
        <RTCView streamURL={this.state.selfViewSrc} style={styles.selfView} />
        {
          mapHash(this.state.remoteList, function (remote, index) {
            return <RTCView key={index} streamURL={remote} style={styles.remoteView} />
          })
        }
        <Button title='退出群聊' onPress={() => { this.goBackToLastPage() }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  selfView: {
    width: 200,
    height: 150,
  },
  remoteView: {
    width: 200,
    height: 150,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  listViewContainer: {
    height: 150,
  },
});

//AppRegistry.registerComponent('RCTWebRTCDemo', () => RCTWebRTCDemo);