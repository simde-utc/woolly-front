import React from "react";
import PropTypes from "prop-types";
import Loader from "components/common/Loader";
import { API_URL } from "utils/constants";


export default function LoginLogout({ action }) {
	// Redirect to login/logout page
	const callback = String(window.location).replace(/(.*)log(in|out)\/?$/, "$1");
	window.location.replace(`${API_URL}/auth/${action}?redirect=${callback}`);

	return <Loader text="Redirection..." />;
}

LoginLogout.propTypes = {
	action: PropTypes.oneOf(["login", "logout"]).isRequired,
};
