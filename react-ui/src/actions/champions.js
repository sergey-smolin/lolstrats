import { API_ENDPOINT_CHAMPIONS } from '../constants/endpoints';

export const FETCH_CHAMPIONS_START = 'FETCH_CHAMPIONS_START';
export const FETCH_CHAMPIONS_SUCCESS = 'FETCH_CHAMPIONS_SUCCESS';
export const FETCH_CHAMPIONS_ERROR = 'FETCH_CHAMPIONS_ERROR';
export const FILTER_CHAMPIONS = 'FILTER_CHAMPIONS';

const requestChampions = () => ({
  type: FETCH_CHAMPIONS_START
})

const requestChampionsSuccess = champions => ({
  type: FETCH_CHAMPIONS_SUCCESS,
  champions
})

const requestChampionsError = () => ({
  type: FETCH_CHAMPIONS_ERROR
})

export const fetchChampions = () => dispatch => {
  dispatch(requestChampions());
  return fetch(API_ENDPOINT_CHAMPIONS).then(res => res.json())
    .then(
      res => dispatch(requestChampionsSuccess(res)),
      err => dispatch(requestChampionsError(err))
    );
}

export const filterChampions = filter => ({
  type: FILTER_CHAMPIONS,
  filter
})