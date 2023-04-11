import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = null;

const peerReducer = (state = initialState, action) => {
    switch (action.type) {
        case GLOBALTYPES.PEER:
            return action.payload

        default:
            return state;
    }
}
export default peerReducer;