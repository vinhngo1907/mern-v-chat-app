import { combineReducers } from 'redux'
import auth from './authReducer'
import status from "./statusReducer";
import modal from "./modalReducer";
import alert from "./alertReducer";
import message from "./messageReducer";
import theme from "./themeReducer";
import socket from "./socketReducer";
import online from "./onlineReducer";

export default combineReducers({
    auth,
    alert,
    status,
    modal,
    message,
    theme,
    socket,
    online
})