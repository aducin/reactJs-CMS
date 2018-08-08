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

@connect((store) => {
	return { account: store.account };
})

export default class AccountContainer extends React.Component {

	constructor(props) {
		super(props);
		this.model = new AccountModel();
		this.state = {...State};
		this.xml = new Xml(this.model, this.props.mainModel);
		this.model.xml.subscribe(path => this.setState({ link: path }));
	}

	componentDidMount() {
		this.model.displayModalMessage.subscribe((bool) => this.handleDisplayMessage(bool));
	}
	componentWillUpdate(nextProps, nextState) {
		if (!nextState.ajaxSent && nextProps.token ) {
			store.dispatch(account.setLoading());
			store.dispatch(account.setAction('getData', {params: {}, token: nextProps.token}));
			this.setState({ ajaxSent: true });
		} else if (nextProps.account.error) {
			this.props.mainModel.setMessage('warning', err.message);
			store.dispatch(account.clearError());
		} else if (nextState.errorHandler) {
			this.modalErrorHandler(nextState);
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
	createXml() {
		this.xml.create(this.state.selected, this.props.token);
	}
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
	modalChange(e) {
		this.setState({ errorHandler: true, modalObj: handleFieldChange(e, this.state.modalObj) });
	}
	modalErrorHandler(state) {
		let error = errorHandler(state.modalObj);
		let modalObj = {...state.modalObj, saveDisabled: disableHandler(state, error)};
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
			}).catch((err) =>{
				this.displayMessage(Config.message.error, 'error');
			});
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
		this.setState({
			ascending: this.state.sortBy === value ? this.state.sortBy : value,
			sortBy: this.state.sortBy === value ? !this.state.ascending : this.state.ascending
		});
	}

	render() {
		const addDefaultOption = (obj) => {
			const message = Config.message.account;
			obj.unshift( <option key={ -1 } value={ message.defaultOption.id }>{ message.defaultOption.name }</option> );
			return obj;
		};
		const state = this.state;
		const data = this.props.account;
		let accountsHeader, accountsDetails, busy, header, message, modal, stateOptions, typeOptions;
		let messageStyle = this.props.success ? Config.alertSuccess : Config.alertError;
		stateOptions = Config.accountStates.map((el, index) => <option key={ index } value={ el.id }>{ el.name }</option>);
		typeOptions = Config.accountTypes.map((el, index) => <option key={ index } value={ el.id }>{ el.name }</option>);
		if (this.props.approved) {
			header = <Header active="accounts" buttonHandler={this.props.logoutHandler.bind(this)} disable={state.disable} />;
			message = <Message message={this.props.toDisplay} messageStyle={messageStyle} />;
			if (this.state.selected.state === -1) {
				addDefaultOption([...stateOptions]);
			}
			if (this.state.selected.type === -1) {
				addDefaultOption([...typeOptions]);
			}
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
			accountsDetails = (
				<AccountDetail
					ascending={state.ascending}
					data={data}
					empty={!Boolean(data.list)}
					selectedRow={state.selectedRow}
					selectRow={this.selectRow.bind(this)}
					sortTable={this.sortTable.bind(this)}
					sortBy={state.sortBy}
				/>
			);
			if (this.state.modal) {
				let title = state.modal === 'add' ? Config.message.account.addTitle : Config.message.account.modifyTitle;
				if (state.modal === 'add') {
					addDefaultOption(stateOptions);
					addDefaultOption(typeOptions);
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
		return (
			<div>
				{header}
				{message}
				{accountsHeader}
				{busy}
				{accountsDetails}
				{modal}
				<div class="col-xs-4 pull-left marginBottom40"></div>
			</div>
		)
	}
}
