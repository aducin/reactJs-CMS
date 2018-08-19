import React from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';

import Config from '../../Config';
import './login.css';

import Checking from './Checking.jsx';
import Cookies from 'universal-cookie';
import Login from '../../helper/login';
import LoginModel from '../../model/loginModel';
import Footer from '../dumb/Footer.jsx';
import Message from './Message.jsx';
import { setLoginState } from '../../functions/login/setLoginState';
import { setMessageStyle } from '../../functions/login/setMessageStyle';

const cookies = new Cookies();

export default class LoginComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = Login;
	}

	componentDidMount() {
		this.getToken();
	}
	componentDidUpdate() {
		if (this.state.checking && this.state.curToken) {
			this.checkToken(this.state.curToken);
		} else if (this.state.checkData) {
			this.checkData();
		} else if (this.state.redirect) {
			this.redirectToDefault();
		} else if (this.state.failure) {
			this.setTimeout();
		}
	}

	checkData() {
    	let login = this.state.login !== undefined && this.state.login.length > 3;
    	let password = this.state.password !== undefined && this.state.password.length > 3;
    	this.setState({ checkData: false, disabled: !(login && password) });
	};
	checkToken(token) {
		LoginModel.checkToken(token)
		.then((response) => {
			if (response.data.success) {
				window.location.href = this.state.defaultLocation;
			} else {
				this.setState({ checking: false });
			}
		});
	};
	getToken() {
		let curCookie = cookies.get('ad9bis');
		let tokenCheck = reactLocalStorage.get('token');
		if (tokenCheck !== undefined || curCookie !== undefined) {
			let token = tokenCheck !== undefined ? tokenCheck : curCookie;
			this.setState({ checking: true, curToken: token });
		}
	}

	handleCheckox = (e) => this.setState({ remember: e.target.checked });

	handleError = (message) => this.setState({ failure: true, success: false, message: message });

	login() {
		if (this.state.login.length > 3 && this.state.password.length > 3) {
			let params = { email: this.state.login, password: this.state.password, remember: this.state.remember };
			LoginModel.login(params, this.state.config)
    		.then((response) => {
    			if (response.data.success) {
						this.setState( setLoginState(response.data.reason, response.data.token));
    			} else {
    				throw new Error(response.data.reason);
    			}
    		})
			.catch(err => this.handleError(err.message));
		}
	};
	redirectToDefault() {
		if (this.state.remember) {
			let now = new Date();
			now.setDate(now.getDate()+7);
			cookies.set('ad9bis', this.state.token, { path: Config.url.serverPath, expires: now });
		}
		reactLocalStorage.set('token', this.state.token);
		window.location.href = this.state.defaultLocation;
	};
	setData = (e) => this.setState({ checkData: true, [e.target.name]: e.target.value });

	setTimeout() {
		setTimeout(function() {
			this.setState({ failure: false, message: null, success: false });
		}.bind(this), Config.timer);
	}

	render() {
		if (this.state.checking) {
			return <Checking />;
		} else {
			let curMessage = this.state.message;
			let message = curMessage ? <Message style={setMessageStyle(this.state)} message={curMessage} /> : null;
			return (
				<div class="backgroundBlue">
					<div class="loginContainer">
						<div class="form-signin">
							<h2 class="form-signin-heading">Panel CMS</h2> 
							<div class="col-sm-12">{message}</div>
							<input type="text" onChange={ this.setData.bind(this) } onKeyUp={ this.setData.bind(this) } name="login" class="centered form-control" placeholder="Podaj nick" value={this.state.login} autoFocus="true"/>
							<input type="password" onChange={ this.setData.bind(this) } onKeyUp={ this.setData.bind(this) } name="password" class="centered form-control" placeholder="Podaj hasło" value={this.state.password} /> 
							<div class="paddingTop5px">
								<label class="checkbox">
									<input type="checkbox" onChange={this.handleCheckox.bind(this)} defaultChecked={this.state.remember} /><span>Zapamiętaj</span>
								</label>
							</div>
							<input type="submit" onClick={ this.login.bind(this) } disabled={this.state.disabled} class="btn btn-lg btn-primary btn-block" value="Zaloguj" />       
						</div>
					</div>
					<Footer curClass="footerLogin" />
				</div>
			);	
		}
	}
}
