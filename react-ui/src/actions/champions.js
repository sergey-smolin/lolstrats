import { API_ENDPOINT_CHAMPIONS } from '../constants/endpoints';

export const FETCH_CHAMPIONS_START = 'FETCH_CHAMPIONS_START';
export const FETCH_CHAMPIONS_SUCCESS = 'FETCH_CHAMPIONS_SUCCESS';
export const FETCH_CHAMPIONS_ERROR = 'FETCH_CHAMPIONS_ERROR';

const requestChampions = () => ({
    type: FETCH_CHAMPIONS_START
})

const requestChampionsSuccess = (champions) => ({
    champions,
    type: FETCH_CHAMPIONS_SUCCESS
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