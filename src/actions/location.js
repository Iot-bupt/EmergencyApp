//import WS from 'react-native-websocket'

export function connectLocation() {
    return dispatch => {
        var ws = new WebSocket("ws://echo.websocket.org");

        ws.onopen = function (evt) {
            console.log("信息管理：socket连接成功！");
            ws.send("Hello WebSockets!");
        };

        ws.onmessage = function (evt) {
            console.log("Received Message: " + evt.data);
            ws.close();
        };

        ws.onclose = function (evt) {
            console.log("Connection closed.");
        };


        ws.onerror = function (event) {
            console.log(event)
        };
    }
}

export function sendLocationMessage(locationArr) {
    return dispatch => {
        console.log(locationArr)
    }
}