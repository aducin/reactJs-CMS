import React from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import store from '../store';
import * as postal from '../actions/postalActions.jsx';
import Busy from '../components/dumb/Busy.jsx';
import Config from '../Config';
import Header from '../components/dumb/Header.jsx';
import Message from '../components/dumb/Message.jsx';
import PostalChange from '../components/modal/PostalChange.jsx';
import PostalDetail from '../components/postal/PostalDetail.jsx';
import PostalHeader from '../components/postal/PostalHeader.jsx';
import PostalModel from '../model/postalModel.js';
import { State } from '../helper/postalState';
import { validateNumber } from '../functions/validateNumber';

@connect((store) => {
	return { postal: store.postal };
})

export default class PostalContainer extends React.Component {
	constructor(props) {
		super(props);	 
		this.state = {...State};
	}

	componentDidUpdate() {
		if (this.props.postal.error) {
			this.props.mainModel.setMessage('warning', Config.error);
			store.dispatch(postal.clearError());
		} else if (this.state.action) {
			let action = this.state.action;
			this[action]();
		}
	}
	componentWillUpdate(nextProps, nextState) {
		if (!nextState.ajaxSent) {
			this.setState({ action: 'getPostal', ajaxSent: true });
		} else if (nextState.action) {
			this.setState({ action: null });
		}
	}
	shouldComponentUpdate(nextProps, extState) {
		return (nextProps.approved && nextProps.token);
	}

	closeModal() {
		let action = this.state.refresh ? 'getPostal' : null;
		this.setState({ action, modal: false });
	}
	displayMessage(state) {
		setTimeout(() => {
			this.setState({
				action: 'closeModal',
				actionMessage: {
					text: undefined,
					type: undefined
				},
				amountToChange: 0
			});
		}, Config.timer);
	}
	getPostal() {
		store.dispatch(postal.setLoading());
		store.dispatch(postal.setAction('getPostal', this.props.token));
	}
	handleAmountToChange(e) {
		let error = validateNumber(e.target.value);
		let curAmount = error ? this.state.amountToChange : e.target.value;
		this.setState({ amountToChange: curAmount, error: error });
	}
	openModal(type) {
		this.setState({ modal: type });
	}
	saveNewAmount() {
		this.setState({ action: 'setAmount', modalInProgress: true });
	}
	setAmount() {
		PostalModel.setData(this.state.amountToChange, this.state.modal)
			.then((response) => {
				if (response.data.success) {
					this.setState({
						action: 'displayMessage',
						actionMessage: { text: response.data.reason, type: 'success' },
						refresh: true
					});
				} else {
					throw new Error(response.data.reason);
				}
			})
			.catch((err) =>{
				this.closeModal();
				this.props.mainModel.setMessage('warning', err.message);
			})
			.finally( () => this.setState({ modalInProgress: false }) );
	}

	render() {
		let data = this.props.postal;
		let busy, header, message, modal, postalDetail, postalHeader;
		let messageStyle = this.props.success ? Config.alertSuccess : Config.alertError;
		if (this.props.approved) {
			header = <Header active="postal" buttonHandler={this.props.logoutHandler.bind(this)} disable={this.state.disable} />;
			message = <Message message={this.props.toDisplay} messageStyle={messageStyle} />;
			postalHeader = (
				<PostalHeader
					amount={data.amount}
					disable={this.props.postal.loading}
					message={Config.message}
					openModal={this.openModal.bind(this)}
				/>
			);
			if (this.props.postal.loading) {
				busy = <Busy title={Config.message.loading} />;
			}
			if (data.list && !this.props.postal.loading) {
				postalDetail = <PostalDetail list={data.list} message={Config.message} />;
			}
			if (this.state.modal) {
				let title = this.state.modal === 'add' ? Config.message.postal.modalAdd : Config.message.postal.modalSubtract;
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
