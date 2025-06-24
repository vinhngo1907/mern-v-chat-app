import { deleteData } from "../actions/globalTypes";
import { MESSAGE_TYPES } from "../actions/messageAction";

const initialState = {
    users: [], // conversations
    resultusers: 0,
    data: [], // messages
    firstLoad: false,
    deletedTempIds: []
}

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case MESSAGE_TYPES.ADD_USER:
            if (state.users.every(u => u._id !== action.payload._id)) {
                return {
                    ...state,
                    users: [action.payload, ...state.users]
                }
            }
            return state;

        case MESSAGE_TYPES.ADD_MESSAGE:
            return {
                ...state,
                data: state.data.map((item) => (
                    item._id === action.payload.recipient || item._id === action.payload.sender
                        ? {
                            ...item,
                            messages: [...item.messages, action.payload],
                            result: item.result + 1
                        }
                        : item
                )),
                users: state.users.map(user =>
                    user._id === action.payload.recipient || user._id === action.payload.sender
                        ? {
                            ...user,
                            text: action.payload.text,
                            media: action.payload.media,
                            call: action.payload.call
                        }
                        : user
                )
            }

        case MESSAGE_TYPES.GET_MESSAGES:
            return {
                ...state,
                data: [...state.data, action.payload]
            }

        case MESSAGE_TYPES.GET_CONVERSATIONS:
            return {
                ...state,
                users: action.payload.newArr,
                resultusers: action.payload.result,
                firstLoad: true
            }
        case MESSAGE_TYPES.DELETE_MESSAGE:
            console.log("action payload", action.payload)
            const newData = state.data.map(item =>
                item._id === action.payload._id
                    ? { ...item, messages: action.payload.newData }
                    : item);
            console.log({
                ...state,
                data: newData,
                newData
            })
            return {
                ...state,
                data: newData
            }
        case MESSAGE_TYPES.DELETE_CV:
            const newMesssages = deleteData(state.data, action.payload._id);
            return {
                ...state,
                users: action.payload.newCV,
                data: newMesssages
            };
        case MESSAGE_TYPES.CHECK_ONLINE_OFFLINE:
            return {
                ...state,
                users: state.users.map(u =>
                    action.payload.includes(u._id) ? { ...u, online: true } : { ...u, online: false }
                )
            }
        case MESSAGE_TYPES.DELETE_TEMP_MESSAGE:
            return {
                ...state,
                // messages: state.data.messages.filter(msg => msg._id !== action.payload.tempId)
                data: state.data.map(item => ({
                    ...item,
                    messages: item.messages.filter(msg => msg._id !== action.payload.tempId)
                }))

            };

        case MESSAGE_TYPES.UPDATE_MESSAGE_ID:
            const { tempId, savedMsg } = action.payload;
            const wasDeleted = state.deletedTempIds?.includes(tempId); // optional chaining

            return {
                ...state,
                data: wasDeleted
                    ? state.data
                    : state.data.map(conversation => ({
                        ...conversation,
                        messages: conversation.messages.map(msg =>
                            msg._id === tempId ? { ...savedMsg, user: msg.user } : msg
                        )
                    })),
                deletedTempIds: state.deletedTempIds?.filter(id => id !== tempId)
            };

        case MESSAGE_TYPES.MARK_TEMP_MESSAGE_DELETED:
            return {
                ...state,
                deletedTempIds: [...(state.deletedTempIds || []), action.payload.tempId]
            };


        default:
            return state;
    }
}

export default messageReducer