function chatReducer(state = [], action) {
    switch (action.type) {
        case 'MSG_IN':
            return state.concat([action.msg]);

        default:
            return state
    }
}

function profileReducer(state = {avatar: null,groups: null,id: null,name: null, password: null,url: null,username: null},action){
    switch (action.type) {
        case 'SET_PROFILE':
            // action传递过来的信息存储在action中
            return Object.assign({},state,action.profile);

        default:
            return state
    }
}

export default function reducers(state={},action){
    // 两个对象都会遍历。根据对应的case进行处理
    return{
        messages:chatReducer(state.messages,action),
        profile:profileReducer(state.profile,action)
    };
}