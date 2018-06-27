import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { reactLocalStorage } from 'reactjs-localstorage';
import Cookies from 'universal-cookie';
import axios from 'axios';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/dom/ajax';
import 'rxjs/add/observable/interval';

import store from '../store.jsx';
import * as product from '../actions/productActions.jsx';
//import * as user from '../actions/userActions.jsx';
import './main.css';

import Config from '../Config.jsx';
import Footer from '../components/dumb/Footer.jsx';
import Helper from '../components/Helper.jsx';

let observable;
let subscription;

@connect((store) => {
    return {
    	user: store.user.userData,
	    error_user: store.user.error,
    };
}) 

export default class App extends React.Component {
	constructor(props) {
		super(props);	    
		this.state = {
			approvalInProgress: false,
			approved: false,
			curPage: null,
			defaultPath: '/',
			error: false,
			ordersSearch: false,
			success: false,
			toDisplay: undefined,
			token: null
		}
	}

	componentDidMount() {
		if (!this.state.approved) {
			this.authorisation();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.approved || (nextProps.location.pathname === this.state.defaultPath && this.props.location.pathname !== this.state.defaultPath)) {
			return true;
		} else {
			if (this.props.location.pathname === this.state.defaultPath && nextProps.location.pathname !== this.state.defaultPath) {
				this.getToken(1);
			}
			return false;
		}
	}

	authorisation() {
		if (!this.state.approved && !this.state.approvalInProgress) {
			this.setState({
				approvalInProgress: true,
			}, () => {
				this.getToken(1);
			});
		}
	}

	checkOrders() {
		/*
		this.setState({
			ordersSearch: true
		}, () => {
		*/
		store.dispatch(product.setOrdersSearch());
		let url = Helper.setUrl('pathOrder', 'last', this.state.token);
		store.dispatch(product.setAction('setLastOrders', url));
/*
			Observable
				.ajax(url)
				.subscribe(
					data => {
						let result = data.response;
						this.setState({
							lastOrdersSearch: false
						}, () => {
							this.setState({
								ordersSearch: false
							}, () => {
								if (result.success) {
									store.dispatch(product.setOrders(result));
								} else {
									throw new Error(result.reason);
								}
							});
						});
					},
					err => {
						console.error(err);
						store.dispatch(product.setError(err.message));
					}
				);
		});
 */
	}

	checkToken(token) {
		let data = {
			action: 'tokenCheck',
			token: token,
		};
		let url = Config.url;
		let curUrl = url.serverPath + 'login?token=' + token;
		axios.get(curUrl)
    	.then((response) => {
    		if (response.data.success) {
    			this.setState({
    				approvalInProgress: false,
    				approved: true,
    				token: token
    			});	
    		} else {
    			this.navigateToLogin();
    		}
    	})
    	.catch((err) =>{
    		this.navigateToLogin();
    	});
	}

	confirmApproved = () => {
		this.setState({
			approvalInProgress: false
		}, () => {
			this.authorisation();
		});
	}

	clearToken() {
		const cookies = new Cookies();
		let curCookie = cookies.get('ad9bis');
		if (curCookie) {
			cookies.remove('ad9bis');
		}
		reactLocalStorage.clear('token');
	}

	getToken(action) {
		const cookies = new Cookies();
		let curCookie = cookies.get('ad9bis');
		let tokenCheck = reactLocalStorage.get('token');
		if (tokenCheck !== undefined || curCookie !== undefined) {
			let token = tokenCheck !== undefined ? tokenCheck : curCookie;
			if (action === 1) {
				this.checkToken(token);
			} else {
				return token;
			}
		} else {
			this.navigateToLogin();
		}
	}

	logout() {
		this.clearToken();
		reactLocalStorage.clear('category');
		reactLocalStorage.clear('manufactorer');
		this.setState({
			success: true,
			toDisplay: Config.message.logout
		}, () => {
			setTimeout(function() {
				this.setState({
					approvalInProgress: false,
					approved: false,
					success: false,
					toDisplay: undefined
				}, () => {
					window.location.href = Config.url.path + Config.url.pathSuffix;
				});
			}.bind(this), Config.timer);
		});
	}

	navigateToLogin() {
		this.setState({
			curPage: 'login',
		}, () => {
			let loginUrl = Config.url.path + Config.url.pathSuffix;
			if (window.location.href !== loginUrl) {
				window.location.href = loginUrl;
			}
		});
	}

	removeDisplay = () => {
		setTimeout(function() {
			this.setState({
				error: false,
				toDisplay: undefined
			});
		}.bind(this), Config.timer);
	}

	setMessage = (error, success, message) => {
		window.scrollTo(0, 0);
		this.setState({
			error: error,
			success: success,
			toDisplay: message
		}, () => {
			this.removeDisplay();
		});
	}

	setOrdersSearch = () => {
		this.checkOrders();
		subscription = Observable.interval(300000)
		.subscribe(int => this.checkOrders());
	}
/*checkOrders
	setOrdersSearch = () => {
		observable = Observable.create((observer) => {
			observer.next(this.checkOrders());
			subscription = setInterval(() => {
				observer.next(this.checkOrders());
			}, 300000);
		});
		observable.subscribe();
	}
*/
	setSuccess = (message) => {
		this.setMessage(false, true, message);
	}

	setWarning = (message) => {
		this.setMessage(true, false, message);
	}

	unsubscribe() {
		if (subscription) {
			subscription.unsubscribe();
			//observable = null;
			//clearInterval(subscription);
		}
	}

    render () {
			let footer, margin, padding;
				if (this.state.curPage !== 'login') {
					footer = <Footer curClass="footerMain" />
					margin = 'marginTop1';
				padding = 'paddingBottom2';
			}
			return (
				<div class={padding}>
					{React.cloneElement(this.props.children, {
						approvalInProgress: this.state.approvalInProgress,
						approved: this.state.approved,
						confirmApproved: this.confirmApproved,
						error: this.state.error,
						logoutHandler: this.logout.bind(this),
						ordersSearch: this.state.ordersSearch,
						searchOrders: this.setOrdersSearch.bind(this),
						setSuccess: this.setSuccess,
						setWarning: this.setWarning,
						success: this.state.success,
						toDisplay: this.state.toDisplay,
						token: this.state.token,
						unsubscribe: this.unsubscribe.bind(this)
					})}
					{footer}
				</div>
			);
		}
}
