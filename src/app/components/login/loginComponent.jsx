import React from 'react';

import Footer from '../dumb/Footer.jsx';

import './login.css';

import Config from '../../Config.jsx';
import InputComponent from '../dumb/inputComponent.jsx';
import { reactLocalStorage } from 'reactjs-localstorage';
import Cookies from 'universal-cookie';
import axios from 'axios';

export default class LoginComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checking: false,
			defaultLocation: "#/products",
			disabled: true,
			failure: false,
			login: '',
			message: null,
			password: '',
			remember: false,
			success: false,
		}
	}

	componentDidMount() {
		const cookies = new Cookies();
		let curCookie = cookies.get('ad9bis');
		let tokenCheck = reactLocalStorage.get('token');
		if (tokenCheck !== undefined || curCookie !== undefined) {
			this.setState({
				checking: true,		
			}, () => { 
				let token = tokenCheck !== undefined ? tokenCheck : curCookie;
				this.checkToken(token);
			});
		}
    }

    checkData() {
    	let login = this.state.login !== undefined && this.state.login.length > 3;
    	let password = this.state.password !== undefined && this.state.password.length > 3;
    	this.setState({
			disabled: !(login && password)
		});
	}

    checkToken(token) {
		let url = Config.url.serverPath + 'login?token=' + token;
		axios.get(url)
		.then((response) => {
			if (response.data.success) {
				window.location.href = this.state.defaultLocation;
			} else {
				this.setState({ checking: false });
			}
		});
	}

	handleCheckox(e) {
		this.setState({
			remember: e.target.checked,
		});
	}

	handleError(message) {
		this.setState({
			failure: true,
			success: false,
			message: message,
		}, () => {
			setTimeout(function() {
				this.setState({
					failure: false,
					message: null,
					success: false,
				});
			}.bind(this), Config.timer);		
		});
	}

	login() {
		var userLogin = this.state.login;
		var password = this.state.password;
		if (userLogin.length > 3 && password.length > 3) {
			let url = Config.url.serverPath + 'login';
			let params = {
				email: userLogin,
				password: password,
				remember: this.state.remember,
			};
			axios.post(url, {params}, this.state.config)
    		.then((response) => {
    			if (response.data.success) {
    				this.setState({
						failure: false,
						success: true,
						message: response.data.reason,
						disabled: true,
					}, () => {
						var token = response.data.token;
						if (this.state.remember) {
							var now = new Date();
							now.setDate(now.getDate()+7);
							const cookies = new Cookies();
							cookies.set('ad9bis', token, { path: Config.url.serverPath, expires: now });
						}
						reactLocalStorage.set('token', token);
						window.location.href = this.state.defaultLocation;
						/*
						setTimeout(function() { 
							this.setState({
								failure: false,
								message: null,
								success: false,
							});
						}.bind(this), Config.timer);	
						*/					
					});
    			} else {
    				this.handleError(response.data.reason);
    			}
    		})
			.catch((err) =>{
				this.handleError(err);
			});
		}
	}

	setData(e) {
		this.setState({
			[e.target.name]: e.target.value 
		}, () => {	
			this.checkData();
		});
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
