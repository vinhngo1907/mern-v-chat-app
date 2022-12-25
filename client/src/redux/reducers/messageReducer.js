import { MESSAGE_TYPES } from "../actions/messageAction";

const initialState = {
    users: [],
    resultusers: 0,
    data: [],
    firstLoad: false
}

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case MESSAGE_TYPES.ADD_USER:
            return {
                ...state,
                users: [action.payload, ...state.users]
            }

        case MESSAGE_TYPES.ADD_MESSAGE:
            return {
                ...state
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