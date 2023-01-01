import { GLOBALTYPES } from "./globalTypes";
import { getDataAPI, postDataAPI } from "../../utils/fetchData";

export const MESSAGE_TYPES = {
    ADD_USER: "ADD_USER",
    ADD_MESSAGE: "ADD_MESSAGE",
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
    CHECK_ONLINE_OFFLINE: "CHECK_ONLINE_OFFLINE"
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

export const addMessage = ({ msg, auth }) => async (dispatch) => {
    try {
        dispatch({ type: MESSAGE_TYPES.ADD_MESSAGE, payload: { ...msg } })
        // const { _id, avatar, username } = auth.user;
        // const newMess = { ...msg, user: { _id, avatar, username, fullname } }
        await postDataAPI('message', msg, auth.token);
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