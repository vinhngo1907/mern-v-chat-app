import { combineReducers } from 'redux'
import auth from './authReducer'
import modal from "./modalReducer";
import alert from "./alertReducer";
import message from "./messageReducer";
import theme from "./themeReducer";
import socket from "./socketReducer";
import online from "./onlineReducer";
import peer from "./peerReducer";
import call from './callReducer';

export default combineReducers({
    auth,
    alert,
    modal,
    message,
    theme,
    socket,
    online,
    peer,
    call
})