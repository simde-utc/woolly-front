import axios from "axios";
import { API_URL } from "../constants";

/**
 * Type prefixes for each reducer
 */
export const API_REDUX_PREFIX = "API";
export const MESSAGE_REDUX_PREFIX = "MESSAGE";

/**
 * Default axios for the Woolly API
 */
export const apiAxios = axios.create({
	baseURL: API_URL,
	xsrfHeaderName: "X-CSRFToken",
	xsrfCookieName: "csrftoken",
});

/**
 */
export const ASYNC_SUFFIXES = {
	loading: "LOADING",
	success: "SUCCESS",
	error: "ERROR",
};

/**
 * Data changes and scopes enums
 */
export const DATA_CHANGES = {
	ASSIGN: "ASSIGN",
	REMOVE: "REMOVE",
};

export const DATA_SCOPES = {
	ONE: "ONE",
	MULTIPLE: "MULTIPLE",
	FULL: "FULL",
};
