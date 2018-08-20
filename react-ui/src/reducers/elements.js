import { ADD_ACTIVE_CATEGORY, REMOVE_ACTIVE_CATEGORY } from '../actions/elements';

const initialState = {
    activeCategories: [],
    activeCategoriesMap: {}
};

export default function elementsReducer(state = initialState, action) {
    switch(action.type) {
        case REMOVE_ACTIVE_CATEGORY:
            const { name } = state.activeCategories.splice(action.index, 1)[0];
            return {
                activeCategories: [ ...state.activeCategories ],
                activeCategoriesMap: {
                    ...state.activeCategoriesMap,
                    [name]: false
                }
            };
        case ADD_ACTIVE_CATEGORY:
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
    return state;
}