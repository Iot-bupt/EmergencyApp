import { LOCATION_WS_URL } from '../const'
import Toast from '@remobile/react-native-toast';

var ws
var TEST_URL = "ws://echo.websocket.org" //连接测试url

export function connectLocation(username) {
    //var url = BASE_URL + '?username=' + username + '&usertype=producer'
    return dispatch => {
        ws = new WebSocket(LOCATION_WS_URL, [username]);

        ws.onopen = function (evt) {
            console.log("信息管理：socket连接成功！");
            Toast.showShortCenter("信息管理：socket连接成功！")
        };

        ws.onmessage = function (evt) {
            console.log("信息管理：Received Message: " + evt.data);
            if (evt.data && evt.data.type == 6) {
                Toast.showShortCenter(evt.data.nickname + '已偏离路线！')
            }
        };

        ws.onclose = function (evt) {
            console.log("信息管理：Connection closed.");
        };


        ws.onerror = function (event) {
            console.log(event)
        };
    }
}

export function sendLocationMessage(type, id, name, locationArr) {
    return dispatch => {
        // 信息管理后台ws数据格式
        // var sendMessage = {
        //     tenantId: id,
        //     staffName: name,
        //     data: [{
        //         longtitude: locationArr[0],
        //         latitude: locationArr[1]
        //     }]
        // }
        var sendMessage = {
            type,
            nickname: name,
            msg: {
                lng: locationArr[0],
                lat: locationArr[1]
            }
        }
        console.log(sendMessage)
        ws.send(JSON.stringify(sendMessage))
    }
}