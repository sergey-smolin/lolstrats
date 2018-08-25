import initialState from '../state';
import {
    FETCH_USER_ERROR,
    FETCH_ITEMS_START,
    FETCH_ITEMS_SUCCESS,
    FETCH_ITEMS_ERROR,
    FETCH_CHAMPIONS_START,
    FETCH_CHAMPIONS_SUCCESS,
    FETCH_CHAMPIONS_ERROR,
    FETCH_RUNES_START,
    FETCH_RUNES_SUCCESS,
    FETCH_RUNES_ERROR,
    FETCH_CATEGORIES_START,
    FETCH_CATEGORIES_SUCCESS,
    FETCH_CATEGORIES_ERROR
} from '../actions/rootActions';

const SRID = 11;

const prepareChampionsData = (json) => {
    return Object.keys(json.data).map(key => json.data[key]);
}

const assembleCategoriesMap = (categories) => {
    // For each object with given id take value of its only property which is an
    // array and add to the resulting array
    return categories.reduce((memo, next) => {
        const key = Object.keys(next)[0];
        const section = next[key].reduce((memo, next) =>
            ({ ...memo, [next.id]: next.name }), {})
        return { ...memo, ...section };
    }, {});
}

// const assembleCategoriesMap = (categories) => {
//     return categories.reduce((memo, next) => {
//       return {
//       ...memo,
//       ...next[Object.keys(next)[0]]
//         .reduce((memo, next) => ({ ...memo, [next.id]: next }), {}),
//       }
//     }, {});
// }

const prepareSRItemData = (data) => {
    return Object.keys(data).reduce(
      (memo, next) => {
        const item = data[next];
        if (item.maps[SRID]) {
          item.description = `<description>${item.description}</description>`;
          return [ ...memo, item ];
        }
        return memo;
      },
    []);
}

export default function rootReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_ITEMS_START:
            return {
                ...state,
                itemsLoading: true
            }
        case FETCH_ITEMS_SUCCESS:
            return {
                ...state,
                items: prepareSRItemData(action.items),
                tree: action.tree,
                itemsLoading: false
            }
        case FETCH_CHAMPIONS_START:
            return {
                ...state,
                championsLoading: true
            }
        case FETCH_RUNES_START:
            return {
                ...state,
                runesLoading: true
            }
        case FETCH_CATEGORIES_START:
            return {
                ...state,
                categoriesLoading: true
            }
        case FETCH_CHAMPIONS_SUCCESS:
            return {
                ...state,
                champions: prepareChampionsData(action.champions),
                championsLoading: false
            }
        case FETCH_RUNES_SUCCESS:
            return {
                ...state,
                runes: action.runes,
                runesLoading: false
            }
        case FETCH_CATEGORIES_SUCCESS:
            return {
                ...state,
                categories: action.categories,
                categoriesMap: assembleCategoriesMap(action.categories),
                categoriesLoading: false
            }
    }
    return state;
}