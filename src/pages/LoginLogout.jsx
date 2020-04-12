import React from 'react';
import Loader from '../components/common/Loader';
import { API_URL } from '../constants';


class Login extends React.Component {
	componentDidMount() {
		this.redirect()
	}

	redirect() {
		const action = this.props.action;
		const callback = String(window.location).replace(/(.*)log(in|out)\/?$/, '$1');
		window.location.replace(`${API_URL}/auth/${action}?redirect=${callback}`);
	}

	render() {
		return <Loader text="Redirection..." />;
	}
}

export default Login;
