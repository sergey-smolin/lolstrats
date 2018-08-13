import { FETCH_USER_START, FETCH_USER_SUCCESS, SET_USER_DATA } from '../actions/user';

const initialState = {
    userLoading: false,
    user: null
};

export default function userReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_USER_START:
            return {
                ...state,
                userLoading: true
            }
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                user: action.user,
                userLoading: false
            }
        case SET_USER_DATA:
            return {
                ...state,
                user: action.user
            }
    }
    return state;
}