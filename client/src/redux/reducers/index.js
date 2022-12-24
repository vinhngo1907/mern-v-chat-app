import { combineReducers } from 'redux'
import auth from './authReducer'
import status from "./statusReducer";
import modal from "./modalReducer";
import alert from "./alertReducer";

export default combineReducers({
    auth,
    alert,
    status,
    modal,
})