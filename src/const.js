export const SERVER_POST = '10.112.217.199:30300'         // 信息管理后台
const LOCATION_SOCKET_POST_M = '10.112.12.81:8101'        // 定位信息websocket后台(信息管理后台)
const LOCATION_SOCKET_POST_G = '10.112.217.199:8000'      // 定位信息websocket后台（WebGIS后台）

export const SERVER_URL = 'http://' + SERVER_POST
export const SOCKET_URL = 'http://10.112.217.199:31001'   // 应急指挥websocket

//export const LOCATION_WS_URL = "ws://"+ LOCATION_SOCKET_POST +"/api/v1/map/websocket"     // 定位信息url(信息管理后台)
export const LOCATION_WS_URL = "ws://"+ LOCATION_SOCKET_POST_G +"/api/warning/webSocket"    // 定位信息url（WebGIS后台）
