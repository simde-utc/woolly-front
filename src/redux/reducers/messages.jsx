import { MESSAGE_REDUX_PREFIX } from "../constants";

const DEFAULT_MESSAGE_STORE = [];

/**
 * Simple push/pop messaging system reducer
 */
export default function messagesReducer(state = DEFAULT_MESSAGE_STORE, action) {
	switch (action.type) {
		case `${MESSAGE_REDUX_PREFIX}_PUSH`:
			const data = action.payload;
			return [...state, data];

		case `${MESSAGE_REDUX_PREFIX}_POP`:
			const removeId = action.payload.id;
			return state.filter((data) => data.id !== removeId);

		default:
			return state;
	}
}
