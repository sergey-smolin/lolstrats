import {
  ADD_ACTIVE_CATEGORY,
  REMOVE_ACTIVE_CATEGORY,
  ADD_ACTIVE_ELEMENT,
  REMOVE_ACTIVE_ELEMENT,
  RESET_ACTIVE_ENTITIES,
  SET_ELEMENTS_FILTER
} from '../actions/elements';

const initialState = {
  activeCategories: [],
  activeCategoriesMap: {},
  activeElements: [],
  activeElementsMap: {
    champions: {},
    items: {},
    runes: {}
  },
  elementsFilter: '',
};

export default function elementsReducer(state = initialState, action) {
  switch(action.type) {
    case REMOVE_ACTIVE_CATEGORY: {
      const { name } = state.activeCategories.splice(action.index, 1)[0];
      return {
        ...state,
        activeCategories: [ ...state.activeCategories ],
        activeCategoriesMap: {
          ...state.activeCategoriesMap,
          [name]: false
        }
      };
    }
    case ADD_ACTIVE_CATEGORY: {
      const { category } = action;
      return {
        ...state,
        activeCategories: [ ...state.activeCategories, category ],
        activeCategoriesMap: {
          ...state.activeCategoriesMap,
          [category.name]: true
        }
      };
    }
    case ADD_ACTIVE_ELEMENT: {
      const { elementType, element } = action;
      const activeElements = [ ...state.activeElements, { type: elementType, data: element } ];
      return {
        ...state,
        activeElements,
        activeElementsMap: {
          ...state.activeElementsMap,
          [elementType]: {
            ...state.activeElementsMap[elementType],
            [element.id]: true
          }
        }
      };
    }
    case REMOVE_ACTIVE_ELEMENT: {
      const { type, data } = state.activeElements.splice(action.index, 1)[0];
      const activeElements = [ ...state.activeElements ];
      return {
        ...state,
        activeElements,
        activeElementsMap: {
          ...state.activeElementsMap,
          [type]: {
            ...state.activeElementsMap[type],
            [data.id]: false
          }
        }
      };
    }
    case SET_ELEMENTS_FILTER:
      return { ...state, elementsFilter: action.filter };
    case RESET_ACTIVE_ENTITIES:
      return {
        ...state,
        activeElements: [],
        activeElementsMap: {
          champions: {},
          items: {},
          runes: {}
        },
        activeCategories: [],
        activeCategoriesMap: {}
      }
    default:
  }
  return state;
}