import { combineReducers } from 'redux';
import root from './root';
import elements from './elements';
import user from './user';

export default combineReducers({
    root,
    elements,
    user
});