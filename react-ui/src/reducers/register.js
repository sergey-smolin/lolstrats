import {
  REGISTER_START,
  REGISTER_SUCCESS,
  REGISTER_ERROR,
  REGISTER_SET_USER_CREDENTIALS,
  REGISTER_FORM_USED
} from '../actions/register';

const initialState = {
  username: '',
  password: '',
  repeatPassword: '',
  formUsed: false,
  registerInProgress: false,
  registrationSuccessfull: false,
  responseError: ''
};

export default function registerReducer(state = initialState, action) {
  switch(action.type) {
    case REGISTER_START:
      return {
        ...state,
        registerInProgress: true
      }
    case REGISTER_SUCCESS:
      return {
        ...state,
        registerInProgress: false,
        registrationSuccessful: true
      }
    case REGISTER_ERROR:
      return {
        ...state,
        registerInProgress: false
      }
    case REGISTER_SET_USER_CREDENTIALS:
      return {
        ...state,
        [action.name]: action.value
      }
    case REGISTER_FORM_USED:
      return {
        ...state,
        formUsed: true
      }
    default:
  }
  return state;
}