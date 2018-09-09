import {
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGIN_SET_USER_CREDENTIALS,
  LOGIN_FORM_USED
} from '../actions/login';

const initialState = {
  username: '',
  password: '',
  formUsed: false,
  loginInProgress: false,
  responseError: ''
};

export default function loginReducer(state = initialState, action) {
  switch(action.type) {
    case LOGIN_START:
      return {
        ...state,
        loginInProgress: true
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        loginInProgress: false,
        user: action.user
      }
    case LOGIN_ERROR:
      return {
        ...state,
        loginInProgress: false
      }
    case LOGIN_SET_USER_CREDENTIALS:
      return {
        ...state,
        [action.name]: action.value
      }
    case LOGIN_FORM_USED:
      return {
        ...state,
        formUsed: true
      }
    default:
  }
  return state;
}