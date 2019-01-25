//import WS from 'react-native-websocket'
var ws
var TEST_URL = "ws://echo.websocket.org" //连接测试url
var BASE_URL = "ws://39.104.189.84:30270/api/v1/map/websocket"

export function connectLocation(username) {
    var url = BASE_URL + '?username=' + username + '&usertype=producer'
    return dispatch => {
        ws = new WebSocket(url);

        ws.onopen = function (evt) {
            console.log("信息管理：socket连接成功！");
        };

        ws.onmessage = function (evt) {
            console.log("信息管理：Received Message: " + evt.data);
        };

        ws.onclose = function (evt) {
            console.log("信息管理：Connection closed.");
        };


        ws.onerror = function (event) {
            console.log(event)
        };
    }
}

export function sendLocationMessage(id, name, locationArr) {
    return dispatch => {
        var sendMessage = {
            tenantId: id,
            staffName: name,
            data: [{
                longtitude: locationArr[0],
                latitude: locationArr[1]
            }]
        }
        console.log(sendMessage)
        ws.send(JSON.stringify(sendMessage))
    }
}