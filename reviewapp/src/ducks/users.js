import axios from 'axios';

const initialState = {
    user: {}
}


//action types
const GET_USER_INFO = 'GET_USER_INFO';

//action creator
export function getUserInfo() {
    //need to have middleware added because we used axios see store.js
    let userData = axios.get('/auth/me').then(res => {
        return res.data;
    })

    return {
        type: GET_USER_INFO,
        payload: userData
    }
}

export default function reducer(state = initialState, action) {
    switch (action.type){
        case GET_USER_INFO + '_FULFILLED':
        //Object.assign always has ({}, state, {something else})
            return Object.assign({}, state, {
                user: action.payload
            })
        default:
        return state;
    }


}