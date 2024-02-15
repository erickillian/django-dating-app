import { combineReducers } from 'redux';
import userReducer from './userReducer'; // You will create userReducer next

export default combineReducers({
    user: userReducer,
});
