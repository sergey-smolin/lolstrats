import {
    API_ENDPOINT_ITEMS,
    API_ENDPOINT_CHAMPIONS,
    API_ENDPOINT_RUNES,
    API_ENDPOINT_CATEGORIES,
    API_ENDPOINT_USER
} from '../constants/endpoints';

export const FETCH_USER_START = 'FETCH_USER_START';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_ERROR = 'FETCH_USER_ERROR';
export const FETCH_ITEMS_START = 'FETCH_ITEMS_START';
export const FETCH_ITEMS_SUCCESS = 'FETCH_ITEMS_SUCCESS';
export const FETCH_ITEMS_ERROR = 'FETCH_ITEMS_ERROR';
export const FETCH_CHAMPIONS_START = 'FETCH_CHAMPIONS_START';
export const FETCH_CHAMPIONS_SUCCESS = 'FETCH_CHAMPIONS_SUCCESS';
export const FETCH_CHAMPIONS_ERROR = 'FETCH_CHAMPIONS_ERROR';
export const FETCH_RUNES_START = 'FETCH_RUNES_START';
export const FETCH_RUNES_SUCCESS = 'FETCH_RUNES_SUCCESS';
export const FETCH_RUNES_ERROR = 'FETCH_RUNES_ERROR';
export const FETCH_CATEGORIES_START = 'FETCH_CATEGORIES_START';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_ERROR = 'FETCH_CATEGORIES_ERROR';

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
        } else {
            dispatch(requestUserError(res.error));
        }
    });
}

const requestItems = () => ({
    type: FETCH_ITEMS_START
})

const requestItemsSuccess = ({ data, tree }) => ({
    items: data,
    tree,
    type: FETCH_ITEMS_SUCCESS
})

const requestItemsError = () => ({
    type: FETCH_ITEMS_ERROR
})

export const fetchItems = () => dispatch => {
    dispatch(requestItems());
    return fetch(API_ENDPOINT_ITEMS).then(res => res.json())
        .then(
            res => dispatch(requestItemsSuccess(res)),
            err => dispatch(requestItemsError(err))
        );
}

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

const requestRunes = () => ({
    type: FETCH_RUNES_START
})

const requestRunesSuccess = runes => ({
    runes,
    type: FETCH_RUNES_SUCCESS
})

const requestRunesError = () => ({
    type: FETCH_RUNES_ERROR
})

export const fetchRunes = () => dispatch => {
    dispatch(requestRunes());
    return fetch(API_ENDPOINT_RUNES).then(res => res.json())
        .then(
            res => dispatch(requestRunesSuccess(res)),
            err => dispatch(requestRunesError(err))
        )
}

const requestCategories = () => ({
    type: FETCH_CATEGORIES_START
})

const requestCategoriesSuccess = categories => ({
    categories,
    type: FETCH_CATEGORIES_SUCCESS
})

const requestCategoriesError = () => ({
    type: FETCH_CATEGORIES_ERROR
})


export const fetchCategories = () => dispatch => {
    dispatch(requestCategories());
    return fetch(API_ENDPOINT_CATEGORIES).then(res => res.json())
        .then(
            res => dispatch(requestCategoriesSuccess(res)),
            err => dispatch(requestCategoriesError(err))
        )
}