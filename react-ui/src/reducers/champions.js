import {
    FETCH_CHAMPIONS_START,
    FETCH_CHAMPIONS_SUCCESS,
    FETCH_CHAMPIONS_ERROR,
} from '../actions/champions';

const prepareChampionsData = (json) => {
    return Object.keys(json.data).map(key => json.data[key]);
}

const initialState = {
  champions: [],
  championsLoading: true
};

export default function championsReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_CHAMPIONS_START:
            return {
                ...state,
                championsLoading: true
            }
        case FETCH_CHAMPIONS_SUCCESS:
            return {
                ...state,
                champions: prepareChampionsData(action.champions),
                championsLoading: false
            }
    }
    return state;
}