export const ADD_ACTIVE_CATEGORY = 'ADD_ACTIVE_CATEGORY';
export const REMOVE_ACTIVE_CATEGORY = 'REMOVE_ACTIVE_CATEGORY';
export const ADD_ACTIVE_ELEMENT= 'ADD_ACTIVE_ELEMENT';
export const REMOVE_ACTIVE_ELEMENT = 'REMOVE_ACTIVE_ELEMENT';
export const RESET_ACTIVE_ENTITIES = 'RESET_ACTIVE_ENTITIES';

export const addActiveCategory = category => ({
    type: ADD_ACTIVE_CATEGORY,
    category
})

export const removeActiveCategory = index => ({
    type: REMOVE_ACTIVE_CATEGORY,
    index
})

export const addActiveElement = (element, elementType) => ({
    type: ADD_ACTIVE_ELEMENT,
    element,
    elementType
})

export const removeActiveElement = index => ({
    type: REMOVE_ACTIVE_ELEMENT,
    index
})

export const resetActiveEntities = () => ({
    type: RESET_ACTIVE_ENTITIES
})