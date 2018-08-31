import { API_ENDPOINT_ITEMS } from '../constants/endpoints';

export const FETCH_ITEMS_START = 'FETCH_ITEMS_START';
export const FETCH_ITEMS_SUCCESS = 'FETCH_ITEMS_SUCCESS';
export const FETCH_ITEMS_ERROR = 'FETCH_ITEMS_ERROR';
export const UPDATE_TAG_MAP = 'UPDATE_TAG_MAP';

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

export const updateTagMap = (name, value) => ({
    type: UPDATE_TAG_MAP,
    name,
    value
});