import { API_ENDPOINT_LOGIN } from '../constants/endpoints'

export const LOGIN_START = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SET_USER_CREDENTIALS = 'LOGIN_SET_USER_CREDENTIALS';
export const LOGIN_FORM_USED = 'LOGIN_FORM_USED';

export const setUserCredentials = (name, value) => ({
  type: LOGIN_SET_USER_CREDENTIALS,
  name,
  value
});

export const setFormUsed = () => ({
  type: LOGIN_FORM_USED
})

const loginStart = () => ({ type: LOGIN_START });

const loginSuccess = () => ({
  type: LOGIN_SUCCESS
})

const loginError = error => ({
  type: LOGIN_ERROR,
  error
})

export const login = (username, password) => dispatch => {
  dispatch(loginStart())
    return fetch(API_ENDPOINT_LOGIN, {
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
        dispatch(loginError(res.message));
      } else {
        dispatch(loginSuccess());
      }
      return res;
    })
}