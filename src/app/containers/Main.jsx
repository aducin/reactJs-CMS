import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { reactLocalStorage } from 'reactjs-localstorage';
import Cookies from 'universal-cookie';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/dom/ajax';
import 'rxjs/add/observable/interval';

import store from '../store';
import * as product from '../actions/productActions.jsx';
import './main.css';
import Config from '../Config';
import Footer from '../components/dumb/Footer.jsx';
import MainModel from '../model/mainModel';
import { State } from '../helper/mainState';
import { setUrl } from '../helper/functions.js';

@connect((store) => {
    return {
    	user: store.user.userData,
	    error_user: store.user.error,
    };
}) 

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.model = new MainModel();
		this.state = State;
	}

	componentDidMount() {
		this.model.success.subscribe((value) => this.setMessage(false, true, value));
		this.model.warning.subscribe((value) => this.setMessage(true, false, value));
		this.getToken(true);
	}
	componentDidUpdate() {
		if (this.state.logout) {
			this.setLogout();
		}
	}
	componentWillUpdate(nextProps, nextState) {
		if (nextState.approved) {
			if (nextState.curPage === 'login') {
				this.setState({ curPage: Config.defaultPage });
			} else if (nextState.removeDisplay) {
				this.removeDisplay();
			}
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.approved || (nextProps.location.pathname === this.state.defaultPath && this.props.location.pathname !== this.state.defaultPath)) {
			return true;
		} else {
			if (this.props.location.pathname === this.state.defaultPath && nextProps.location.pathname !== this.state.defaultPath) {
				this.getToken(true);
			}
			return false;
		}
	}

	checkToken(token) {
		let data = {
			action: 'tokenCheck',
			token: token
		};
		this.model.checkToken(token)
    	.then((response) => {
    		if (response.data.success) {
    			this.setState({
    				approved: true,
    				token: token
    			});	
    		} else {
					this.clearToken();
    			throw new Error(response.data.reason);
    		}
    	})
    	.catch((err) =>{
    		this.navigateToLogin();
    	});
	}

	clearToken() {
		const cookies = new Cookies();
		let curCookie = cookies.get('ad9bis');
		if (curCookie) {
			cookies.remove('ad9bis');
		}
		reactLocalStorage.clear('token');
	};
	getToken(action) {
		const cookies = new Cookies();
		let curCookie = cookies.get('ad9bis');
		let tokenCheck = reactLocalStorage.get('token');
		if (tokenCheck !== undefined || curCookie !== undefined) {
			let token = tokenCheck !== undefined ? tokenCheck : curCookie;
			if (action) {
				this.checkToken(token);
			} else {
				return token;
			}
		} else {
			this.navigateToLogin();
		}
	};
	logout = () => {
		this.clearToken();
		reactLocalStorage.clear('category');
		reactLocalStorage.clear('manufactorer');
		this.setState({
			curPage: 'login',
			logout: true,
			success: true,
			toDisplay: Config.message.logout
		});
	};
	navigateToLogin() {
		this.setState({ curPage: 'login' });
		let url = Config.url.path + Config.url.pathSuffix;
		if (window.location.href !== url) {
			window.location.href = url;
		}
	};
	removeDisplay() {
		setTimeout(function() {
			this.setState({
				error: false,
				toDisplay: undefined
			});
		}.bind(this), Config.timer);
	};
	setLogout() {
		setTimeout(function() {
			window.location.href = Config.url.path + Config.url.pathSuffix;
			this.setState({
				approved: false,
				logout: false,
				success: false,
				toDisplay: undefined
			});
		}.bind(this), Config.timer);
	};
	setMessage = (error, success, message) => {
		window.scrollTo(0, 0);
		this.setState({
			error: error,
			removeDisplay: true,
			success: success,
			toDisplay: message
		});
	};
	setSuccess = (message) => {
		this.setMessage(false, true, message);
	};
	setWarning = (message) => {
		this.setMessage(true, false, message);
	};

	render () {
		let footer, padding;
		if (this.state.curPage && this.state.curPage !== 'login') {
			footer = <Footer />
			padding = 'paddingBottom2';
		}
		return (
			<div class={padding}>
				{React.cloneElement(this.props.children, {
					approved: this.state.approved,
					error: this.state.error,
					logoutHandler: this.logout,
					mainModel: this.model,
					ordersSearch: this.state.ordersSearch,
					setSuccess: this.setSuccess,
					setWarning: this.setWarning,
					success: this.state.success,
					toDisplay: this.state.toDisplay,
					token: this.state.token,
				})}
				{footer}
			</div>
		);
	}
}
