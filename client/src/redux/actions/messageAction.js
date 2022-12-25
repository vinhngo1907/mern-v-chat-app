import { GLOBALTYPES } from "./globalTypes";
import { getDataAPI, postDataAPI } from "../../utils/fetchData";

export const MESSAGE_TYPES = {
    ADD_USER: "ADD_USER",
    ADD_MESSAGE: "ADD_MESSAGE",
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
}

export const addMessage = ({ msg, auth }) => async (dispatch) => {
    try {
        await postDataAPI('message', msg, auth.token);
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg || err } })
    }
}

export const getConversations = ({ page, auth }) => async (dispatch) => {
    try {
        const res = await getDataAPI(`conversation?limit=${page * 9}`, auth.token);
        let newArr = [];
        res.data.conversations.forEach(item => {
            item.recipients.forEach(cv => {
                if (cv._id !== auth.user._id) {
                    newArr.push({ ...cv, text: item.text })
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