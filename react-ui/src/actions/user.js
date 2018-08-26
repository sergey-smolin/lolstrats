import { API_ENDPOINT_USER } from '../constants/endpoints'

export const FETCH_USER_START = 'FETCH_USER_START';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_ERROR = 'FETCH_USER_ERROR';
export const SET_USER_DATA = 'SET_USER_DATA';

const USER_NOT_LOGGED_IN = 'The user is not logged in';

const requestUser = () => ({
    type: FETCH_USER_START
})

const requestUserSuccess = user => ({
    user,
    type: FETCH_USER_SUCCESS
})

const requestUserError = () => ({
    type: FETCH_USER_ERROR
})

export const fetchUser = () => dispatch => {
    dispatch(requestUser());
    return fetch(API_ENDPOINT_USER, {
        credentials: 'include'
        }).then(res => res.json()).then(res => {
        if (res.result === 'success') {
            dispatch(requestUserSuccess(res.data));
        } else if (res.result === 'error' && res.message === USER_NOT_LOGGED_IN) {
            dispatch(requestUserSuccess(null))
        } else {
            dispatch(requestUserError(res.error));
        }
    });
}

export const setUserData = user => ({
    type: SET_USER_DATA,
    user
})