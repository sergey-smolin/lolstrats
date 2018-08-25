import { combineReducers } from 'redux';
import root from './root';
import elements from './elements';
import user from './user';
import items from './items';
import videos from './videos';

export default combineReducers({
    root,
    elements,
    user,
    items,
    videos
});