import { UPDATE_TAG_MAP } from '../actions/items';

const initialState = {
    tagMap: {},
    activeTags: []
};

export default function itemsReducer(state = initialState, action) {
    switch(action.type) {
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