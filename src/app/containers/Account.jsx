import React from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import moment from 'moment';

import 'rxjs/add/operator/switchMap';

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
import { State } from '../helper/accountState';
import { createReducedObj } from '../helper/functions';
import { changeDate, setModalData } from '../helper/accountFunctions';

@connect((store) => {
	return { account: store.account };
})

export default class AccountContainer extends React.Component {

	constructor(props) {
		super(props);
		this.model = new AccountModel();
		this.state = State;
	}

	componentDidMount() {
		this.model.displayModalMessage.subscribe((bool) => this.handleDisplayMessage(bool));
		this.model.list
			.switchMap(observable$ => observable$)
			.subscribe( (list) => this.handleList(list) ),
			(err) => this.props.mainModel.setMessage('warning', err.message);
		this.model.loading.subscribe((bool) => this.setState({ inProgress: bool }));
	}

	componentDidUpdate() {
		if (this.state.errorHandler) {
			this.modalErrorHandler();
		}
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
			this.setState({ errorHandler: null });
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return (nextProps.approved && nextProps.token);
	}

	closeModal(type) {
		if (type === 'success') {
			let params = this.setParams({...this.state.selected});
			store.dispatch(account.setLoading());
			store.dispatch(account.setAction('getData', {params, token: this.props.token}));
		}
		this.setState({
			modal: false,
			modalDisable: false,
			modalMessage: { text: null, type: null }
		});
	}
	createXml() {
		if (this.state.selected.dateFrom !== null && this.state.selected.dateTo !== null) {
			let from = this.state.selected.dateFrom.format('YYYY-MM-DD');
			let to = this.state.selected.dateTo.format('YYYY-MM-DD');
			this.model.createXml(from, to , this.props.token)
				.then((response) => {
					if (response.data.success) {
						this.props.mainModel.setMessage('success', response.data.reason);
						this.setState({ link: response.data.path });
					} else {
						throw new Error(response.data.reason);
					}
				})
				.catch((err) => this.props.mainModel.setMessage('warning', err.message));
		}
	}
	dateChange(field, data) {
		let obj = changeDate(field, data, this.state.modalObj);
		obj.saveDisabled = this.modalDisableHandler(this.state);
		this.setState({ modalObj: obj });
	}
	displayMessage(text, type) {
		this.model.setMessage();
		this.setState({ modalMessage: { text: text, type: type }});
	}
	handleDisplayMessage(bool) {
		if (!bool) {
			let type = this.state.modalMessage.type;
			this.closeModal(type);
		}
		this.setState({ display: bool });
	}
	handleList(list) {
		let data = createReducedObj(list.data, this.state.innerFields);
		store.dispatch(account.setList(data));
	}
	modalChange(e) {
		let name = e.target.name;
		let value = e.target.value;
		if (name === 'amount') {
			value = value.replace(',', '.');
		}
		let obj = {...this.state.modalObj};
		obj[name] = value;
		this.setState({
			errorHandler: true,
			modalObj: obj
		});
	}
	modalDisableHandler(state) {
		let disableCHeck = Config.accountObligatory.find((el) => !state.modalObj[el] || state.modalObj[el] === -1 || state.modalObj[el] === undefined);
		let disabled = (this.state.modal === 'modify' && disableCHeck === 'closed') ? false : Boolean(disableCHeck);
		if ((!state.modalObj.cashDate || state.modalObj.cashDate === '') && (!state.modalObj.receiptDate || state.modalObj.receiptDate === '')) {
			disabled = true;
		}
		return disabled;
	}
	modalErrorHandler() {
		let error = {};
		Config.accountNumbers.forEach((el) => {
			if (this.state.modalObj[el]) {
				if (isNaN(this.state.modalObj[el])) {
					error[el] = true;
				}
			}
		});
		let saveDisabled = this.modalDisableHandler(this.state);
		let modalObj = {...this.state.modalObj, saveDisabled: saveDisabled};
		this.setState({
			modalObj: modalObj,
			modalObjError: error
		});
	}
	modalSave() {
		this.setAccount();
		this.setState({ modalDisable: true });
	}
	openModal(action) {
		let obj = setModalData(action, this.props.account.list, this.state.selectedRow);
		this.setState({
			modal: action,
			modalObj: obj
		});
	}
	selectChange(e) {
		let name = e.target.name;
		let selected = {...this.state.selected};
		selected[name] = e.target.value;
		store.dispatch(account.setLoading());
		store.dispatch(account.setAction('getData', {params: this.setParams(selected), token: this.props.token}));
		this.setState({ selected: selected });
	}
	selectRow(id) {
		let curSelected = null;
		let listCheck = this.props.account.list.findIndex((el) => { return el.id === id});
		if (this.state.selectedRow !== id && listCheck !== -1) {
			let closed = this.props.account.list[listCheck].closed;
			if (closed) {
				this.props.mainModel.setMessage('error', Config.message.account.closed);
			} else {
				curSelected = id;
			}
		}
		this.setState({ selectedRow: curSelected });
	}
	setAccount() {
		let data = {
			...this.state.modalObj,
			token: this.props.token
		};
		for (let key in data) {
			if (data.hasOwnProperty(key)) {
				let index = Config.accountNumbers.findIndex((el) => key === el);
				if (index !== -1 && !this.state.modalObj[key]) {
					data[key] = 0;
				} else if (key === 'address' || key === 'remarks') {
					data[key] = this.state.modalObj[key] ? this.state.modalObj[key] : null;
				}
			}
		}
		let action = this.state.modal === 'add' ? 'rowSave' : 'rowUpdate';
		this.model[action](data).then((response) => {
			let type = response.data.success ? 'success' : 'error';
			this.displayMessage(response.data.reason, type);
		}).catch((err) =>{
			this.displayMessage(Config.message.error, 'error');
		});
	}
	setDate(name, value) {
		let selected = {...this.state.selected};
		selected[name] = value;
		const createXml = selected.dateFrom !== null && selected.dateTo !== null;
		store.dispatch(account.setLoading());
		store.dispatch(account.setAction('getData', {params: this.setParams(selected), token: this.props.token}));
		this.setState({
			createXml: createXml,
			selected: selected
		});
	}
	setParams(selected) {
		let params = {};
		for (let el in selected) {
			if (selected[el] && selected[el] !== -1) {
				params[el] = selected[el] instanceof moment ? selected[el].format("YYYY-MM-DD") : selected[el];
			}
		}
		return params;
	}
	sortTable(value, sort) {
		let curSortBy, curSort;
		curSortBy = this.state.sortBy === value ? this.state.sortBy : value;
		curSort = this.state.sortBy === value ? !this.state.ascending : this.state.ascending;
		this.setState({
			ascending: curSort,
			sortBy: curSortBy
		});
	}

	render() {
		const addDefaultOption = (obj) => {
			const message = Config.message.account;
			obj.unshift( <option key={ -1 } value={ message.defaultOption.id }>{ message.defaultOption.name }</option> );
			return obj;
		};
		let data = this.props.account;
		let accountsHeader, accountsDetails, busy, header, message, modal, stateOptions, typeOptions;
		let messageStyle = this.props.success ? Config.alertSuccess : Config.alertError;
		stateOptions = Config.accountStates.map((el, index) => <option key={ index } value={ el.id }>{ el.name }</option>);
		typeOptions = Config.accountTypes.map((el, index) => <option key={ index } value={ el.id }>{ el.name }</option>);
		if (this.props.approved) {
			header = (
				<div class="height12">
					<Header
						active="accounts"
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
			let curStateOpt = [...stateOptions];
			if (this.state.selected.state === -1) {
				addDefaultOption(curStateOpt);
			}
			let curTypeOpt = [...typeOptions];
			if (this.state.selected.type === -1) {
				addDefaultOption(curTypeOpt);
			}
			accountsHeader = (
				<AccountHeader
					accountModal={this.openModal.bind(this)}
					createXml={this.createXml.bind(this)}
					dateChangeHandler={this.setDate.bind(this)}
					disable={this.state.inProgress}
					handleSelectChange={this.selectChange.bind(this)}
					link={this.state.link}
					selected={this.state.selected}
					selectedRow={this.state.selectedRow}
					states={curStateOpt}
					types={curTypeOpt}
					xml={this.state.createXml}
				/>
			);
			if (this.props.loading) {
				busy = <Busy title={Config.message.loading} />;
			}
			let empty = !Boolean(data.list);
			accountsDetails = (
				<AccountDetail
					ascending={this.state.ascending}
					columns={Config.accountColumns}
					data={data}
					empty={empty}
					selectedRow={this.state.selectedRow}
					selectRow={this.selectRow.bind(this)}
					sortTable={this.sortTable.bind(this)}
					sortBy={this.state.sortBy}
				/>
			);
			if (this.state.modal) {
				let title = this.state.modal === 'add' ? Config.message.account.addTitle : Config.message.account.modifyTitle;
				let modalObj = this.state.modalObj;
				if (this.state.modal === 'add') {
					addDefaultOption(stateOptions);
					addDefaultOption(typeOptions);
				}
				modal = (
					<AccountModal
						close={this.closeModal.bind(this)}
						data={modalObj}
						dateChangeHandler={this.dateChange.bind(this)}
						disable={this.state.modalDisable}
						error={this.state.modalObjError}
						handleChange={this.modalChange.bind(this)}
						modalMessage={this.state.modalMessage}
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
