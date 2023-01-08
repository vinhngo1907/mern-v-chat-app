import { deleteData, GLOBALTYPES } from "./globalTypes";
import { deleteDataAPI, getDataAPI, postDataAPI } from "../../utils/fetchData";

export const MESSAGE_TYPES = {
    ADD_USER: "ADD_USER",
    ADD_MESSAGE: "ADD_MESSAGE",
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
    CHECK_ONLINE_OFFLINE: "CHECK_ONLINE_OFFLINE",
    DELETE_MESSAGE: "DELETE_MESSAGE",
    DELETE_USER: "DELETE_USER",
}

export const getConversations = ({ page, auth }) => async (dispatch) => {
    try {
        const res = await getDataAPI(`conversation?limit=${page * 9}`, auth.token);
        let newArr = [];
        res.data.conversations.forEach(item => {
            item.recipients.forEach(cv => {
                if (cv._id !== auth.user._id) {
                    newArr.push({ ...cv, text: item.text, media: item.media, call: item.call })
                }
            })
        });

        dispatch({
            type: MESSAGE_TYPES.GET_CONVERSATIONS,
            payload: {
                newArr,
                result: res.data.result,
            }
        });
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg || err } });
    }
}

export const addMessage = ({ msg, auth, socket }) => async (dispatch) => {
    const { _id, avatar, username, fullname } = auth.user;
    const newMess = { ...msg, user: { _id, avatar, username, fullname } }
    socket.emit('addMessage', { ...newMess });
    try {
        const res = await postDataAPI('message', msg, auth.token);
        dispatch({ type: MESSAGE_TYPES.ADD_MESSAGE, payload: { ...msg, _id: res.data.message._id } });
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg || err } })
    }
}

export const getMessages = ({ id, auth, page = 1 }) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token);
        // console.log(res.data)
        const newData = { ...res.data, messages: res.data.messages.reverse() }
        // console.log(res.data)
        dispatch({ type: MESSAGE_TYPES.GET_MESSAGES, payload: { ...newData, _id: id, page } });

    } catch (err) {
        console.log(err);
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg || err } })
    }
}

export const deleteMessage = ({ msg, auth, data }) => async (dispatch) => {
    const newData = deleteData(data, msg._id);
    dispatch({ type: MESSAGE_TYPES.DELETE_MESSAGE, payload: { newData, _id: msg.recipient } });
    try {
        await deleteDataAPI(`message/${msg._id}`, auth.token);
    } catch (err) {
        console.log(err);
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response?.data?.msg || err } })
    }
}

export const deleteConversation = ({ id, auth, users }) => async (dispatch) => {
    try {

    } catch (err) {
        console.log(err);
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response?.data?.msg || err } })
    }
}