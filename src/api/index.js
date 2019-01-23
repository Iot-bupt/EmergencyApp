import maryData from './maryData'
import felixData from './felixData'
import friendsInfo from './friendsInfo'
import groupsInfo from './groupsInfo'
const BASE_URL = 'http://10.112.17.185:8086'

export function getMetaData(url) {
    return {
        //测试用户mary
        "data": maryData,

        //测试用户felix
        //"data": felixData
    }

    // @TODO 需要登陆的权限
    // fetch(BASE_URL + url, {
    //     method: "get",
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json',
    //     },

    // }).then((response) => response.json())
    //     .then((responseJson) => {
    //         console.log(responseJson)
    //         return responseJson;
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     });
}

export function genToken(url) {
    return {
        "success": true,
        //测试用户mary
        "token1": "382ed36763297d6237c3a998c7e35f39",
        "token2": "3bb1603ebb6d0fd34cb880c6aa62701b",

        //测试用户felix
        //token1: "dc6f940cb0ba72697981e6aa873a8aa0",
        //token2: "3007203d4a337c166c737133833a2f07"
    }
}

export function getFriendsInfo(url) {
    return {
        "data": friendsInfo
    }
}

export function getGroupsInfo(url) {
    return {
        "data": groupsInfo
    }
}

export function getProfileById(id) {
    let url = BASE_URL + '/api/v1/user/userById?Id=' + id
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'text/html',
        }
    }).then((res) => {
        if (res.status == '200') {
            res.json()
                .then((json) => {   
                    console.log(json)
                    var profile=json
                    return profile
                })
        } else {
            Toast.showShortCenter('网络请求错误:' + res.status)
        }
    }).catch((error) => {
        console.error("error")
        console.error(error)

    })
}