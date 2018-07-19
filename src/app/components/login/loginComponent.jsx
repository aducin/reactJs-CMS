import React from 'react';

import Footer from '../dumb/Footer.jsx';

import './login.css';

import Config from '../../Config';
import { reactLocalStorage } from 'reactjs-localstorage';
import Cookies from 'universal-cookie';
import LoginModel from '../../model/loginModel';

const cookies = new Cookies();

export default class LoginComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checkData: false,
			checking: false,
			curToken: null,
			defaultLocation: "#/products",
			disabled: true,
			failure: false,
			login: '',
			message: null,
			password: '',
			redirect: false,
			remember: false,
			token: null
		}
	}

	componentDidUpdate() {
		if (this.state.checking && this.state.curToken) {
			this.checkToken(this.state.curToken);
		} else if (this.state.checkData) {
			this.checkData();
		} else if (this.state.redirect) {
			this.redirectToDefault();
		}
	}
	componentWillUpdate(nextProps, nextState) {
		if (nextState.checkData) {
			this.setState({ checkData: false });
		} else if (nextState.failure) {
			this.setTimeout();
		}
		let curCookie = cookies.get('ad9bis');
		let tokenCheck = reactLocalStorage.get('token');
		if (tokenCheck !== undefined || curCookie !== undefined) {
			let token = tokenCheck !== undefined ? tokenCheck : curCookie;
			this.setState({
				checking: true,
				curToken: token
			});
		}
	}

	checkData() {
    	let login = this.state.login !== undefined && this.state.login.length > 3;
    	let password = this.state.password !== undefined && this.state.password.length > 3;
    	this.setState({
			disabled: !(login && password)
		});
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
	handleCheckox(e) {
		this.setState({
			remember: e.target.checked,
		});
	};
	handleError(message) {
		this.setState({
			failure: true,
			success: false,
			message: message
		});
	};
	login() {
		var userLogin = this.state.login;
		var password = this.state.password;
		if (userLogin.length > 3 && password.length > 3) {
			let params = {
				email: userLogin,
				password: password,
				remember: this.state.remember,
			};
			LoginModel.login(params, this.state.config)
    		.then((response) => {
    			if (response.data.success) {
						this.setState({
							disabled: true,
							failure: false,
							success: true,
							message: response.data.reason,
							redirect: true,
							token: response.data.token
						});
    			} else {
    				throw new Error(response.data.reason);
    			}
    		})
			.catch((err) =>{
				this.handleError(err.message);
			});
		}
	};
	redirectToDefault() {
		var token = this.state.token;
		if (this.state.remember) {
			var now = new Date();
			now.setDate(now.getDate()+7);
			cookies.set('ad9bis', token, { path: Config.url.serverPath, expires: now });
		}
		reactLocalStorage.set('token', token);
		window.location.href = this.state.defaultLocation;
	};
	setData(e) {
		this.setState({
			checkData: true,
			[e.target.name]: e.target.value
		});
	};
	setTimeout() {
		setTimeout(function() {
			this.setState({
				failure: false,
				message: null,
				success: false,
			});
		}.bind(this), Config.timer);
	}

	render() {
		var message;
		if (this.state.success) {
			var messageStyle = "alert alert-success";
		} else if (this.state.failure) {
			var messageStyle = "alert alert-danger";
		}
		if (this.state.message) {
			message = <div class={messageStyle}>
					<p>{this.state.message}</p>
				</div>
		}
		if (this.state.checking) {
			return (
				<div>
					<div class="col-sm-3 pull-left">
					</div>
					<div class="col-sm-6 pull-left">
        				<h2>{Config.message.authorisation}</h2>
        			</div>
        		</div>
			);
		} else {
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
