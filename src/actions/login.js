/**
 * @flow
 *
 * 登陆和账户action
 */

export function setProfile(profile) {
    return {
        type: 'SET_PROFILE',
        profile
    };
}

export function setMyProfile(profile) {
    // action通过dispatch方法传递到reducer，进而改变redux的state
    return dispatch => {
        dispatch(setProfile(profile))
    }
}