//import WS from 'react-native-websocket'
var ws

export function connectLocation() {
    return dispatch => {
        ws = new WebSocket("ws://echo.websocket.org");

        ws.onopen = function (evt) {
            console.log("信息管理：socket连接成功！");
            ws.send("Hello WebSockets!");
        };

        ws.onmessage = function (evt) {
            console.log("Received Message: " + evt.data);
        };

        ws.onclose = function (evt) {
            console.log("Connection closed.");
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
            data: {
                longtitude: locationArr[0],
                latitude: locationArr[1]
            }
        }
        console.log(sendMessage)
        ws.send(JSON.stringify(sendMessage))
    }
}