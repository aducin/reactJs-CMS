import React from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { reactLocalStorage } from 'reactjs-localstorage';
import axios from 'axios';

import store from '../store.jsx';
import * as postal from '../actions/postalActions.jsx';

import Busy from '../components/dumb/Busy.jsx';
import Config from '../Config.jsx';
import Header from '../components/dumb/Header.jsx';
import Helper from '../components/Helper.jsx';
import Message from '../components/dumb/Message.jsx';

import PostalChange from '../components/modal/PostalChange.jsx';
import PostalDetail from '../components/postal/PostalDetail.jsx';
import PostalHeader from '../components/postal/PostalHeader.jsx';

@connect((store) => {
	return {
		postal: store.postal
	};
})

export default class PostalContainer extends React.Component {
	constructor(props) {
		super(props);	 
		this.state = {
			action: null,
			actionMessage: {
				type: undefined,
				text: undefined
			},
			ajaxSent: false,
			amountToChange: 0,
			error: false,
			inProgress: false,
			modal: false,
			modalInProgres: false
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.approved && nextProps.token) {
			if (!nextState.ajaxSent) {
				this.setState({
					ajaxSent: true,
					inProgress: true
				}, () => {
					this.getPostal();
				});
			}
		}
	}

	closeModal() {
		this.setState({
			modal: false
		});
	}

	getPostal() {
		let url = Helper.setUrl('pathPostal', this.props.token);
		axios.get(url)
			.then((response) => {
				this.setState({
					inProgress: false
				}, () => {
					if (response.data.success) {
						store.dispatch(postal.getAmount(response.data.list));
					} else {
						throw new Error(response.data.reason);
					}
				});
			})
			.catch((err) =>{
				let message = err.message || Config.message.error;
				this.props.setWarning(message);
			});
	}

	handleAmountToChange(e) {
		let value = e.target.value.replace(',', '.');
		let error = isNaN(value);
		let curAmount = error ? this.state.amountToChange : value;
		this.setState({
			amountToChange: curAmount,
			error: error
		});
	}

	openModal(type) {
		this.setState({
			modal: type
		});
	}

	saveNewAmount() {
		let data = {
			action: this.state.modal,
			amount: this.state.amountToChange
		};
		let url = Config.url.serverPath + 'postal';
		this.setState({
			modalInProgress: true
		}, () => {
			axios.put(url, {data}, this.state.config)
				.then((response) => {
					if (response.data.success) {
						this.setState({
							actionMessage: {
								text: response.data.reason,
								type: 'success'
							},
							modalInProgress: false
						}, () => {
							setTimeout(() => {
								this.setState({
									actionMessage: {
										text: undefined,
										type: undefined
									},
									amountToChange: 0
								}, () => {
									if (response.data.success) {
										this.getPostal();
									}
									this.closeModal();
								});
							}, Config.timer);
						});
					} else {
						throw new Error(response.data.reason);
					}
				})
				.catch((err) =>{
					this.closeModal();
					let message = err.message || Config.message.error;
					this.props.setWarning(message);
				});
		});
	}

	render() {
		let data = this.props.postal;
		let busy, header, message, messageStyle, modal, postalDetail, postalHeader;
		if (this.props.success) {
		  	messageStyle = "alert alert-success alertHeight textAlignCenter";
		} else if (this.props.error) {
	  		messageStyle = "alert alert-danger alertHeight textAlignCenter";
		}
		if (this.props.approved) {
			header = (
				<div class="height12">
					<Header
						active="postal"
						buttonHandler={this.props.logoutHandler.bind(this)}
						disable={this.state.disable}
						fields={Config.fields}
					/>
				</div>
			);
			message = (
				<Message
					message={this.props.toDisplay}
					messageStyle={messageStyle}
				/>
			);
			postalHeader = (
				<PostalHeader
					amount={data.amount}
					disable={this.state.inProgress}
					message={Config.message}
					openModal={this.openModal.bind(this)}
				/>
			);
			if (this.state.inProgress) {
				busy = <Busy title={Config.message.loading} />;
			}
			if (data.list && !this.state.inProgress) {
				postalDetail = (
					<PostalDetail
						list={data.list}
						message={Config.message}
					/>
				);
			}
			if (this.state.modal) {
				let postalMessage = Config.message.postal;
				let title = this.state.modal === 'add' ? postalMessage.modalAdd : postalMessage.modalSubtract;
				modal = (
					<PostalChange
						actionMessage={this.state.actionMessage}
						amount={this.props.postal.amount}
						amountChangeHandler={this.handleAmountToChange.bind(this)}
						amountToChange={this.state.amountToChange}
						close={this.closeModal.bind(this)}
						error={this.state.error}
						message={Config.message}
						modalInProgress={this.state.modalInProgress}
						save={this.saveNewAmount.bind(this)}
						show={this.state.modal}
						title={title}
					/>
				);
			}
		}
		return (
			<div>
				{header}
				{message}
				{postalHeader}
				{busy}
				{postalDetail}
				{modal}
			</div>
		)
	}
}

