import io from '../utils/socket.io/socket.io';
import { SOCKET_POST } from '../const';
let socket

export function receiveMsg(msg) {
    return {
        type: 'MSG_IN',
        msg
    };
}

export function connectChat(authString) {
    return dispatch => {
        //socket = io.connect('http://39.104.189.84:30200'
        // socket = io.connect( SOCKET_POST
        // // ,{
        // //     "reconnect": true,
        // //     "auto connect": true,
        // //     "force new connection": true
        // // }
        // );

        // socket.on("connect_error", function (error) {
        //     console.error(error);
        // });
        // socket.on('disconnect', function () {
        //     console.log('disconnect')
        // });
        // socket.on('connect', function () {
        //     console.log('应急指挥：socket连接成功！')
        //     setTimeout(() => {
        //         console.log('应急指挥：auth ok.')
        //         socket.emit('auth', authString)
        //     }, 2000);

            // // //群组接受消息测试
            // var msg={"id":0,"createTime":1445676996823,"fromId":202,"msgType":1,"target":{"id":"160","type":-1},"content":"this is a message__1__2","expireTime":0}
            // dispatch(receiveMsg(msg))
            // var msg={"id":0,"createTime":1445676996823,"fromId":204,"msgType":1,"target":{"id":"190","type":-1},"content":"this is a message__3__3","expireTime":0}
            // dispatch(receiveMsg(msg))
        // });
        // socket.on('msg',function(msg){
        //     // console.log(msg)
        //     dispatch(receiveMsg(msg))
        // })

        //fast-test
        //群组接受消息测试
        var msg={"id":0,"createTime":1582121299000,"fromId":202,"msgType":1,"target":{"id":"160","type":-1},"content":"欢迎加入巡检人员oncall群👏","expireTime":0}
        dispatch(receiveMsg(msg))
        var msg={"id":0,"createTime":1582121299000,"fromId":203,"msgType":1,"target":{"id":"190","type":-1},"content":"欢迎加入智能巡检效率沟通群👏","expireTime":0}
        dispatch(receiveMsg(msg))

        //个人接受消息测试
        var msg={"id":0,"createTime":1582071691000,"fromId":205,"msgType":0,"target":{"id":"204","type":-1},"content":"你好Mary，我是felix😄","expireTime":0}
        dispatch(receiveMsg(msg))
    }
}

export function sendMessage(msg) {
    return dispatch => {
        console.log('socket client: send msg:' + msg)
        //socket.emit('msg', msg,function(rep){console.log(rep)})
    }
}

export function concatMessageWhenSend(msg){
    return dispatch => {
        dispatch(receiveMsg(msg))
        var msg2={"id":0,"createTime":1582121659000,"fromId":203,"msgType":1,"target":{"id":"190","type":-1},"content":"欢迎欢迎👏👏👏","expireTime":0}
        dispatch(receiveMsg(msg2))
    }
}
