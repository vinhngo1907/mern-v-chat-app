import { deleteData, editData, GLOBALTYPES } from "./globalTypes";
import { deleteDataAPI, getDataAPI, postDataAPI, putDataAPI } from "../../utils/fetchData";
// import { createNotify } from "./notifyAction";
import { v4 as uuidv4 } from 'uuid';

export const MESSAGE_TYPES = {
    ADD_USER: "ADD_USER",
    ADD_MESSAGE: "ADD_MESSAGE",
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
    CHECK_ONLINE_OFFLINE: "CHECK_ONLINE_OFFLINE",
    DELETE_MESSAGE: "DELETE_MESSAGE",
    EDIT_MESSAGE: "EDIT_MESSAGE",
    DELETE_CV: "DELETE_CV",
    UPDATE_MESSAGE_ID: "UPDATE_MESSAGE_ID",
    DELETE_TEMP_MESSAGE: "DELETE_TEMP_MESSAGE",
    MARK_TEMP_MESSAGE_DELETED: "MARK_TEMP_MESSAGE_DELETED"
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

// export const addMessage = ({ msg, auth, socket }) => async (dispatch) => {
//     // dispatch({type: MESSAGE_TYPES.ADD_MESSAGE, payload: msg})
//     const { _id, avatar, username, fullname } = auth.user;
//     const newMess = { ...msg, user: { _id, avatar, username, fullname } }
//     socket.emit('addMessage', { ...newMess });
//     try {
//         const res = await postDataAPI('message', msg, auth.token);
//         // Notify
//         const notify = {
//             id: res.data.message._id,
//             text: msg.text,
//             recipients: [msg.recipient],
//             url: `/messages/${msg.sender}`,
//             content: msg.text ? 'mentioned you in a message.' : 'has media or/and contact on your mess.',
//             image: auth.user.avatar
//         }

//         dispatch(createNotify({ msg: notify, auth, socket }))
//         dispatch({ type: MESSAGE_TYPES.ADD_MESSAGE, payload: { ...msg, _id: res.data.message._id } });
//     } catch (err) {
//         dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg || err } })
//     }
// }

export const addMessage = ({ msg, auth, socket }) => async (dispatch) => {
    const tempId = `temp-${uuidv4()}`; // temp ID
    console.log({ tempId })
    const tempMsg = {
        ...msg,
        _id: tempId,
        user: {
            _id: auth.user._id,
            avatar: auth.user.avatar,
            username: auth.user.username,
            fullname: auth.user.fullname
        },
        createdAt: new Date().toISOString()
    };

    // Display immediately in UI
    dispatch({ type: MESSAGE_TYPES.ADD_MESSAGE, payload: tempMsg });
    socket.emit('addMessage', tempMsg);
    // return
    try {
        const res = await postDataAPI('message', msg, auth.token);
        const savedMsg = res.data.message;

        // Update message that had real _id
        dispatch({
            type: MESSAGE_TYPES.UPDATE_MESSAGE_ID,
            payload: {
                tempId,
                savedMsg
            }
        });
        console.log({ savedMsg, tempId })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.msg || err.message }
        });
    }
};

export const getMessages = ({ id, auth, page = 1 }) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token);
        // console.log(res.data)
        const newData = { ...res.data, messages: res.data.messages.reverse() }
        // console.log(res.data)
        dispatch({ type: MESSAGE_TYPES.GET_MESSAGES, payload: { ...newData, _id: id, page } });

    } catch (err) {
        console.log(err);
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg || err } });
    }
}

export const loadMoreMessages = ({ auth, id, page = 1 }) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token);
        const newData = { ...res.data, messages: res.data.messages.reverse() }
        // console.log(res.data)
        dispatch({ type: MESSAGE_TYPES.GET_MESSAGES, payload: { ...newData, _id: id, page } });
    } catch (err) {
        console.log(err);
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response?.data?.msg || err } });
    }
}

export const editMessage = ({ id, msg, auth, data, socket }) => async (dispatch) => {
    const newData = editData(data, msg, id);
    dispatch({ type: MESSAGE_TYPES.EDIT_MESSAGE, payload: { newData, _id: msg.recipient } });
    try {
        await putDataAPI(`message/${msg._id}`, auth.token)
    } catch (err) {
        console.log(err);
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg || err } });
    }
}

// export const deleteMessage = ({ msg, auth, data, socket }) => async (dispatch) => {
//     const newData = deleteData(data, msg._id);
//     dispatch({ type: MESSAGE_TYPES.DELETE_MESSAGE, payload: { newData, _id: msg.recipient } });
//     socket.emit('deleteMessage', { newData, _id: msg.sender, recipient: msg.recipient });
//     try {
//         await deleteDataAPI(`message/${msg._id}`, auth.token);
//     } catch (err) {
//         console.log(err);
//         dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response?.data?.msg || err } })
//     }
// }

export const deleteMessage = ({ msg, auth, data, socket }) => async (dispatch) => {
    // If new message has temp ID
    console.log({ msg })
    console.log(">>>>>", msg._id?.startsWith('temp-'))
    if (msg._id?.startsWith('temp-')) {
        dispatch({ type: MESSAGE_TYPES.MARK_TEMP_MESSAGE_DELETED, payload: { tempId: msg._id } });
        dispatch({ type: MESSAGE_TYPES.DELETE_TEMP_MESSAGE, payload: { tempId: msg._id } });
        try {
            await postDataAPI('message/mark-temp-deleted', { tempId: msg._id }, auth.token);
        } catch (err) {
            console.error("Redis mark delete failed", err);
        }

        return;
    }
    console.log("[>>>CO _ID NE<<<]", msg._id);
    const newData = deleteData(data, msg._id)
    dispatch({
        type: MESSAGE_TYPES.DELETE_MESSAGE, payload: {
            _id: msg.recipient,
            newData
        }
    });
    socket.emit('deleteMessage', {
        msg, listMessages: newData
    });
    try {
        await deleteDataAPI(`message/${msg._id}`, auth.token);
    } catch (err) {
        console.log("ERROR: ", err);
        // dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response?.data?.msg || err } })
    }
}

export const deleteConversation = ({ id, auth, users }) => async (dispatch) => {
    try {
        const newCV = deleteData(users, id);
        dispatch({ type: MESSAGE_TYPES.DELETE_CV, payload: { newCV, _id: id } });
        await deleteDataAPI(`conversation/${id}`, auth.token);
    } catch (err) {
        console.log(err);
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response?.data?.msg || err } })
    }
}