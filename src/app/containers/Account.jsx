import React from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import store from '../store';
import * as account from '../actions/accountActions.jsx';
import Busy from '../components/dumb/Busy.jsx';
import Config from '../Config';
import Header from '../components/dumb/Header.jsx';
import Message from '../components/dumb/Message.jsx';
import AccountDetail from '../components/account/AccountDetail.jsx';
import AccountHeader from '../components/account/AccountHeader.jsx';
import AccountModal from '../components/modal/AccountModal.jsx';
import AccountModel from '../model/accountModel';
import Xml from '../classes/xml';
import { State } from '../helper/accountState';
import { accountPrepare } from '../functions/account/accountPrepare';
import { changeDate } from '../functions/changeDate';
import { createReducedObj } from '../functions/createReducedObj';
import { disableHandler } from '../functions/account/disableHandler';
import { errorHandler } from '../functions/account/errorHandler';
import { handleFieldChange } from '../functions/account/handleFieldChange';
import { rowHandle } from '../functions/account/rowHandle';
import { selectHandle } from '../functions/account/selectHandle';
import { setModalData } from '../functions/account/setModalData';
import { setParams } from '../functions/account/setParams';
import { renderComponent, setList } from '../functions/jsx/account.jsx';

@connect((store) => {
	return { account: store.account };
})

export default class AccountContainer extends React.Component {

	constructor(props) {
		super(props);
		this.model = new AccountModel();
		this.state = {...State};
		this.xml = new Xml(this.model, this.props.mainModel);
		this.model.displayModalMessage.subscribe((bool) => this.handleDisplayMessage(bool));
		this.model.xml.subscribe(path => this.setState({ link: path }));
	}

	static getDerivedStateFromProps(nextProps, previousState) {
		if (!previousState.ajaxSent && nextProps.token ) {
			store.dispatch(account.setLoading());
			store.dispatch(account.setAction('getData', {params: {}, token: nextProps.token}));
			return {ajaxSent: true};
		}
		return null;
	}
	componentDidUpdate() {
		if (this.props.account.error) {
			store.dispatch(account.clearError());
			this.props.mainModel.setMessage('warning', err.message);
		} else if (this.state.errorHandler) {
			this.modalErrorHandler();
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return (nextProps.approved && nextProps.token);
	}

	closeModal(type) {
		if (type === 'success') {
			let params = setParams({...this.state.selected});
			store.dispatch(account.setLoading());
			store.dispatch(account.setAction('getData', {params, token: this.props.token}));
		}
		this.setState({ modal: false, modalDisable: false, modalMessage: { text: null, type: null } });
	}

	createXml =() => this.xml.create(this.state.selected, this.props.token);

	dateChange(field, data) {
		let obj = changeDate(field, data, this.state.modalObj);
		obj.saveDisabled = disableHandler(this.state, this.state.modalObjError);
		this.setState({ modalObj: obj });
	}
	displayMessage(text, type) {
		this.model.setMessage();
		this.setState({ modalMessage: { text: text, type: type }});
	}
	handleDisplayMessage(bool) {
		if (!bool) {
			this.closeModal(this.state.modalMessage.type);
		}
		this.setState({ display: bool });
	}

	modalChange = (e) => this.setState({ errorHandler: true, modalObj: handleFieldChange(e, this.state.modalObj) });

	modalErrorHandler() {
		let error = errorHandler(this.state.modalObj);
		let modalObj = {...this.state.modalObj, saveDisabled: disableHandler(this.state, error)};
		this.setState({ errorHandler: null, modalObj: modalObj, modalObjError: error });
	}
	modalSave() {
		this.setAccount();
		this.setState({ modalDisable: true });
	}
	openModal(action) {
		let modalObj = setModalData(action, this.props.account.list, this.state.selectedRow);
		this.setState({ modal: action, modalObj });
	}
	selectChange(e) {
		let selected = selectHandle(e, this.state.selected);
		store.dispatch(account.setLoading());
		store.dispatch(account.setAction('getData', {params: setParams(selected), token: this.props.token}));
		this.setState({ selected: selected });
	}
	selectRow(id) {
		let curSelected = rowHandle(id, this.props.account.list, this.props.mainModel, this.state.selectedRow);
		this.setState({ selectedRow: curSelected });
	}
	setAccount() {
		let data = accountPrepare(this.state, this.state.token);
		let action = this.state.modal === 'add' ? 'rowSave' : 'rowUpdate';
		this.model[action](data)
			.then((response) => {
				let type = response.data.success ? 'success' : 'error';
				this.displayMessage(response.data.reason, type);
			}).catch((err) => this.displayMessage(Config.message.error, 'error'));
	}
	setDate(name, value) {
		let selected = {...this.state.selected};
		selected[name] = value;
		store.dispatch(account.setLoading());
		store.dispatch(account.setAction('getData', {params: setParams(selected), token: this.props.token}));
		let createXml = selected.dateFrom !== null && selected.dateTo !== null;
		this.setState({ createXml, selected });
	}
	sortTable(value) {
		let ascending = this.state.sortBy === value ? !this.state.ascending : this.state.ascending;
		let sortBy = this.state.sortBy === value ? this.state.sortBy : value;
		this.setState({ ascending, sortBy });
	}

	render() {
		const state = this.state;
		let accountsHeader, accountsDetails, busy, header, message, modal, stateOptions, typeOptions;
		let messageStyle = this.props.success ? Config.alertSuccess : Config.alertError;
		stateOptions = setList('accountStates', this.state.selected.state);
		typeOptions = setList('accountTypes', this.state.selected.type);
		if (this.props.approved) {
			header = <Header active="accounts" buttonHandler={this.props.logoutHandler.bind(this)} disable={state.disable} />;
			message = <Message message={this.props.toDisplay} messageStyle={messageStyle} />;
			accountsHeader = (
				<AccountHeader
					accountModal={this.openModal.bind(this)}
					createXml={this.createXml.bind(this)}
					dateChangeHandler={this.setDate.bind(this)}
					disable={state.inProgress}
					handleSelectChange={this.selectChange.bind(this)}
					link={state.link}
					selected={state.selected}
					selectedRow={state.selectedRow}
					states={[...stateOptions]}
					types={[...typeOptions]}
					xml={this.state.createXml}
				/>
			);
			if (this.props.loading) {
				busy = <Busy title={Config.message.loading} />;
			}
			let empty = !Boolean(this.props.account.list);
			accountsDetails = (
				<AccountDetail
					ascending={state.ascending} data={this.props.account} empty={empty} selectedRow={state.selectedRow}
					selectRow={this.selectRow.bind(this)} sortTable={this.sortTable.bind(this)} sortBy={state.sortBy}
				/>
			);
			if (this.state.modal) {
				let title = state.modal === 'add' ? Config.message.account.addTitle : Config.message.account.modifyTitle;
				if (state.modal === 'add') {
					stateOptions = setList('accountStates', -1);
					typeOptions = setList('accountTypes', -1);
				}
				modal = (
					<AccountModal
						close={this.closeModal.bind(this)}
						data={state.modalObj}
						dateChangeHandler={this.dateChange.bind(this)}
						disable={state.modalDisable}
						error={state.modalObjError}
						handleChange={this.modalChange.bind(this)}
						modalMessage={state.modalMessage}
						saveModal={this.modalSave.bind(this)}
						show={this.state.modal}
						states={stateOptions}
						title={title}
						types={typeOptions}
					/>
				);
			}
		}
		return renderComponent(header, message, accountsHeader, busy, accountsDetails, modal);
	}
}
