import { API_ENDPOINT_REGISTER } from '../constants/endpoints'

export const REGISTER_START = 'REGISTER_START';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_ERROR = 'REGISTER_ERROR';
export const REGISTER_SET_USER_CREDENTIALS = 'REGISTER_SET_USER_CREDENTIALS';
export const REGISTER_FORM_USED = 'REGISTER_FORM_USED';

export const setUserCredentials = (name, value) => ({
  type: REGISTER_SET_USER_CREDENTIALS,
  name,
  value
});

export const setFormUsed = () => ({
  type: REGISTER_FORM_USED
})

const registerStart = () => ({ type: REGISTER_START });

const registerSuccess = () => ({
  type: REGISTER_SUCCESS
})

const registerError = error => ({
  type: REGISTER_ERROR,
  error
})

export const register = (username, password) => dispatch => {
  dispatch(registerStart())
    return fetch(API_ENDPOINT_REGISTER, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        username,
        password
      })
    }).then(res => res.json()).then(res => {
      if (res.result === 'error') {
        dispatch(registerError(res.message));
      } else {
        dispatch(registerSuccess());
      }
      return res;
    })
}