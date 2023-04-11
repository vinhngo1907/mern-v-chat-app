import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from "./globalTypes";

export const NOTIFY_TYPES = {
    GET_NOTIFIES: 'GET_NOTIFIES',
    CREATE_NOTIFY: 'CREATE_NOTIFY',
    REMOVE_NOTIFY: 'REMOVE_NOTIFY',
    UPDATE_NOTIFY: 'UPDATE_NOTIFY',
    UPDATE_SOUND: 'UPDATE_SOUND',
    DELETE_ALL_NOTIFIES: 'DELETE_ALL_NOTIFIES'
}

export const createNotify = ({ msg, auth, socket }) => async (dispatch) => {
    try {
        const res = await postDataAPI('notification', msg, auth.token);
        socket.emit("createNotify", {
            ...res.data.notify,
            user: {
                username: auth.user.username,
                avatar: auth.user.avatar
            }
        })
    } catch (err) {
        console.log(err);
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response?.data?.msg || err.response?.data?.message } })
    }
}

export const getNotifies = (token) => async (dispatch) => {
    try {
        const res = await getDataAPI('notification', token);
        dispatch({ type: NOTIFY_TYPES.GET_NOTIFIES, payload: res.data.notifies });

    } catch (err) {
        console.log(err.response);
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response?.data?.msg || err.response?.data?.message } })
    }
}

export const removeNotify = ({ msg, auth }) => async (dispatch) => {

    try {
        await deleteDataAPI(`notification/${msg._id}`, auth.token);

    } catch (err) {
        console.log(err);
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response?.data?.msg || err.response?.data?.message } })
    }
}

export const isReadNotify = ({ msg, auth }) => async (dispatch) => {
    dispatch({ type: NOTIFY_TYPES.UPDATE_NOTIFY, payload: { ...msg, isReaded: true } })
    try {
        await patchDataAPI(`notification/${msg._id}`, null, auth.token);

    } catch (err) {
        console.log(err);
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response?.data?.msg || err.response?.data?.message } })
    }
}

export const deleteAllNotifies = (token) => async (dispatch) => {
    dispatch({ type: NOTIFY_TYPES.DELETE_ALL_NOTIFIES, pyaload: [] })
    try {
        await deleteDataAPI('notification', token);
    } catch (err) {
        console.log(err);
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response?.data?.msg || err.response?.data?.message } })
    }
}