export const UPDATE_TAG_MAP = 'UPDATE_TAG_MAP';

export const updateTagMap = (name, value) => ({
    type: UPDATE_TAG_MAP,
    name,
    value
});