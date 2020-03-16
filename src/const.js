const HOST215 = '39.104.189.84'                    // 信息管理后台
const LOCALHOST = '10.112.153.2'                   // 应急指挥websocket后台
const LOCATION_SOCKET_POST_M = '10.112.12.81:8101'        // 定位信息websocket后台(信息管理后台)
const LOCATION_SOCKET_POST_G = '10.112.217.199:8000'     // 定位信息websocket后台（WebGIS后台）

export const SERVER_POST = 'http://' + HOST215 + ':30300'
export const SOCKET_POST = 'http://' + LOCALHOST + ':8888'
//export const LOCATION_WS_URL = "ws://"+ LOCATION_SOCKET_POST +"/api/v1/map/websocket"
export const LOCATION_WS_URL = "ws://"+ LOCATION_SOCKET_POST_G +"/api/warning/webSocket"