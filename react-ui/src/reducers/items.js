import {
  FETCH_ITEMS_START,
  FETCH_ITEMS_SUCCESS,
  FETCH_ITEMS_ERROR,
  UPDATE_TAG_MAP
} from '../actions/items';

const SRID = 11;

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

const initialState = {
  items: [],
  tree: [],
  itemsLoading: true,
  tagMap: {},
  activeTags: [],
};

export default function itemsReducer(state = initialState, action) {
  switch(action.type) {
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
    case UPDATE_TAG_MAP: {
      const { name, value } = action;
      const tagMap = {
        ...state.tagMap,
        [name]: value
      }
      const activeTags = Object.keys(tagMap).reduce((memo, next) => {
        if (tagMap[next]) return [ ...memo, next ];
        return memo;
      }, []);

      return {
        ...state,
        tagMap,
        activeTags
      };
    }
  }
  return state;
}