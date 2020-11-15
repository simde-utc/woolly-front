import { MESSAGE_REDUX_PREFIX } from "../constants";

const messagesActions = {
	pushError: (error, title = null, params = {}) => {
		console.error(title || "Erreur inconnue", error);
		if (error.isAxiosError && error.response) {
			const { data, status } = error.response;
			title = title || data.error || `Erreur API inconnue (${status})`;
			const details = data.message;
			return messagesActions.pushMessage(title, details, "error", params);
		}
		return messagesActions.pushMessage(
			title || "Erreur inconnue",
			String(error),
			"error",
			params
		);
	},

	pushMessage: (title, details = null, severity = null, params = {}) => ({
		type: `${MESSAGE_REDUX_PREFIX}_PUSH`,
		payload: {
			id: Math.random().toString(36).substring(2),
			title,
			details,
			severity,
			params,
		},
	}),

	popMessage: (id) => ({
		type: `${MESSAGE_REDUX_PREFIX}_POP`,
		payload: { id },
	}),
};

export default messagesActions;
