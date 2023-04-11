import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = false;

const statusReducer = (state = initialState, action) => {
	// const {
	// 	type,
	// 	payload: { isAuthenticated, user }
	// } = action

	switch (action.type) {
		case GLOBALTYPES.STATUS:
			return action.payload

		default:
			return state
	}
}
export default statusReducer;