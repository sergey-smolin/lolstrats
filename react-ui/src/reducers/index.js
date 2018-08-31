import { combineReducers } from 'redux';
import root from './root';
import elements from './elements';
import user from './user';
import champions from './champions';
import items from './items';
import videos from './videos';
import modal from './modal';

export default combineReducers({
    root,
    elements,
    user,
    items,
    champions,
    videos,
    modal
});