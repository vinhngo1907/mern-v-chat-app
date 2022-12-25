import { combineReducers } from 'redux'
import auth from './authReducer'
import status from "./statusReducer";
import modal from "./modalReducer";
import alert from "./alertReducer";
import message from "./messageReducer";
import theme from "./themeReducer";

export default combineReducers({
    auth,
    alert,
    status,
    modal,
    message,
    theme
})