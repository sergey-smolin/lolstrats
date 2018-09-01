import {
  FETCH_CHAMPIONS_START,
  FETCH_CHAMPIONS_SUCCESS,
  FETCH_CHAMPIONS_ERROR,
  FILTER_CHAMPIONS,
} from '../actions/champions';

const prepareChampionsData = (json) => {
  return Object.keys(json.data).map(key => json.data[key]);
}

const initialState = {
  champions: [],
  championsLoading: true,
  filteredChampions: []
};

export default function championsReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_CHAMPIONS_START:
      return {
        ...state,
        championsLoading: true
      }
    case FETCH_CHAMPIONS_SUCCESS: {
      const championsData = prepareChampionsData(action.champions);
      return {
        ...state,
        champions: championsData,
        filteredChampions: championsData,
        championsLoading: false
      }
    }
    case FILTER_CHAMPIONS:
      return {
        ...state,
        filteredChampions: state.champions
          .filter(champion => champion.name.toLowerCase().includes(action.filter.toLowerCase()))
      }
  }
  return state;
}