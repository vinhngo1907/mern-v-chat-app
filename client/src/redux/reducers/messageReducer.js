import { MESSAGE_TYPES } from "../actions/messageAction";

const initialState = {
    users: [], // conversations
    resultusers: 0,
    data: [], // messages
    firstLoad: false
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
                ))
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

        default:
            return state;
    }
}

export default messageReducer