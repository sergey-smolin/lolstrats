import initialState from '../state';
import {
    FETCH_RUNES_START,
    FETCH_RUNES_SUCCESS,
    FETCH_RUNES_ERROR,
    FETCH_CATEGORIES_START,
    FETCH_CATEGORIES_SUCCESS,
    FETCH_CATEGORIES_ERROR,
    ALL_ELEMENTS_LOADED
} from '../actions/rootActions';

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

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
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
    case FETCH_RUNES_ERROR:
      return {
        ...state,
        runesLoading: false
      }
    case FETCH_CATEGORIES_ERROR:
    case ALL_ELEMENTS_LOADED:
      return {
        ...state,
        allElementsLoaded: true
      }
    default:
  }
  return state;
}