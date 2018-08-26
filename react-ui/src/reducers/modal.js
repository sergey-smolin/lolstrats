import {
    SHOW_MODAL,
    HIDE_MODAL,
    SHOW_STATIC_MODAL,
    HIDE_STATIC_MODAL
} from '../actions/modal';

const initialState = {
    modalMessage: null,
    staticModalMessage: null
};

export default function modalReducer(state = initialState, action) {
    switch(action.type) {
        case SHOW_MODAL:
            return {
                ...state,
                modalMessage: action.message
            };
        case HIDE_MODAL:
            return {
                ...state,
                modalMessage: null
            };
        case SHOW_STATIC_MODAL:
            return {
                ...state,
                staticModalMessage: action.message
            };
        case HIDE_STATIC_MODAL:
            return {
                ...state,
                staticModalMessage: null
            };
    }
    return state;
}