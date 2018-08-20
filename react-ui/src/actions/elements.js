export const ADD_ACTIVE_CATEGORY = 'ADD_ACTIVE_CATEGORY';
export const REMOVE_ACTIVE_CATEGORY = 'REMOVE_ACTIVE_CATEGORY';

export const addActiveCategory = category => ({
    type: ADD_ACTIVE_CATEGORY,
    category
})

export const removeActiveCategory = index => ({
    type: REMOVE_ACTIVE_CATEGORY,
    index
})