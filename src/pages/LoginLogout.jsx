import React from 'react';
import axios from 'axios';
import Loader from '../components/common/Loader';

class Login extends React.Component {
	componentDidMount() {
		this.redirect()
	}

	redirect() {
		const apiURL = axios.defaults.baseURL;
		const action = this.props.action;
		const callback = String(window.location).replace(/(.*)log(in|out)\/?$/, '$1');
		window.location.replace(`${apiURL}/auth/${action}?redirect=${callback}`);
	}

	render() {
		return <Loader text="Redirection..." />;
	}
}

export default Login;
