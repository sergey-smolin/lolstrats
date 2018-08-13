import { combineReducers } from 'redux';
import rootReducer from './rootReducer';
import user from './user';

export default combineReducers({
    rootReducer,
    user
});