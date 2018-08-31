import {
    API_ENDPOINT_ITEMS,
    API_ENDPOINT_RUNES,
    API_ENDPOINT_CATEGORIES,
} from '../constants/endpoints';

export const FETCH_RUNES_START = 'FETCH_RUNES_START';
export const FETCH_RUNES_SUCCESS = 'FETCH_RUNES_SUCCESS';
export const FETCH_RUNES_ERROR = 'FETCH_RUNES_ERROR';
export const FETCH_CATEGORIES_START = 'FETCH_CATEGORIES_START';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_ERROR = 'FETCH_CATEGORIES_ERROR';
export const ALL_ELEMENTS_LOADED = 'ALL_ELEMENTS_LOADED';

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

export const allElementsLoaded = () => ({
    type: ALL_ELEMENTS_LOADED
});