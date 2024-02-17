import { combineReducers } from 'redux';
import userReducer from './userReducer';
import datingReducer from './datingReducer';


export default combineReducers({
    user: userReducer,
    dating: datingReducer,
});
