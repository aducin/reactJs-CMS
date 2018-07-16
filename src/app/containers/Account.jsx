import React from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import moment from 'moment';

import store from '../store';
import * as account from '../actions/accountActions.jsx';

import Busy from '../components/dumb/Busy.jsx';
import Config from '../Config';
import Header from '../components/dumb/Header.jsx';
import Message from '../components/dumb/Message.jsx';

import AccountDetail from '../components/account/AccountDetail.jsx';
import AccountModal from '../components/modal/AccountModal.jsx';
import AccountHeader from '../components/account/AccountHeader.jsx';
import AccountModel from '../model/accountModel.jsx';
import State from '../components/account/state';
import { createReducedObj } from '../components/Helper.jsx';

@connect((store) => {
	return {
		account: store.account
	};
})

export default class AccountContainer extends React.Component {
	constructor(props) {
		super(props);	 
		this.state = State;
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.approved && nextProps.token) {
			if (!nextState.ajaxSent) {
				this.setState({
					accountData: {
						selected: null,
						list: []
					},
					ajaxSent: true,
					inProgress: true
				}, () => {
					this.getAccounts();
				});
			}
		}
	}

	closeModal() {
		this.setState({
			modal: false
		});
	}

	createXml() {
		if (this.state.selected.dateFrom !== null && this.state.selected.dateTo !== null) {
			let from = this.state.selected.dateFrom.format('YYYY-MM-DD');
			let to = this.state.selected.dateTo.format('YYYY-MM-DD');
			AccountModel.createXml(from, to , this.props.token)
				.then((response) => {
					if (response.data.success) {
						this.props.setSuccess(response.data.reason);
						this.setState({
							link: response.data.path
						});
					} else {
						throw new Error(response.data.reason);
					}
				})
				.catch((err) =>{
					let message = err.message || Config.message.error;
					this.props.setWarning(message);
				});
		}
	}

	dateChange(field, data) {
		let obj = {...this.state.modalObj};
		let momentVar = field + 'Date';
		let stringVar = field + 'Time';
		obj[momentVar] = data;
		obj[stringVar] = data.format("YYYY-MM-DD");
		this.setState({
			modalObj: obj
		}, () => {
			let obj = {...this.state.modalObj};
			obj.saveDisabled = this.modalDisableHandler(this.state.modalObjError);
			this.setState({
				modalObj: obj
			});
		});
	}

	displayMessage(text, type) {
		let message = {
			text: text,
			type: type
		};
		this.setState({
			modalMessage: message
		}, () => {
			setTimeout(function() {
				let message = {
					text: null,
					type: null
				};
				this.setState({
					modalDisable: false,
					modalMessage: message,
				}, () => {
					this.closeModal();
					if (type === 'success') {
						this.getAccounts(true);
					}
				});
			}.bind(this), Config.timer);
		});
	}

	getAccounts(custom = false) {
		let params, url;
		this.setState({
			inProgress: true
		}, () => {
			if (custom) {
				params = this.setParams();
			}
			let observable = AccountModel.getData(params, this.props.token);
			observable.subscribe((response) => {
				let data = createReducedObj(response.data, this.state.innerFields);
				let accountData = {...this.state.accountData, list: response.data.list};
				this.setState({
					accountData: accountData
				}, () => {
					store.dispatch(account.setList(data));
				});
			}, (err) => {
				let message = err.message || Config.message.error;
				this.props.setWarning(message);
			}, () => {
				this.setState({
					inProgress: false
				});
			});
		});
	}

	modalChange(e) {
		let name = e.target.name;
		let value = e.target.value;
		if (name === 'amount') {
			value = value.replace(',', '.');
		}
		let obj = {...this.state.modalObj, [name]: value};
		this.setState({
			modalObj: obj
		}, () => {
			this.modalErrorHandler();
		});
	}

	modalDisableHandler(error) {
		let errorLength = Object.keys(error).length;
		if (errorLength > 0) {
			return true;
		} else {
			let disabled = false;
			Config.accountObligatory.forEach((el) => {
				if (this.state.modalObj[el] === undefined || this.state.modalObj[el] === '' || this.state.modalObj[el] === -1) {
					disabled = true;
				}
			});
			if ((!this.state.modalObj.cashDate || this.state.modalObj.cashDate === '') && (!this.state.modalObj.receiptDate || this.state.modalObj.receiptDate === '')) {
				disabled = true;
			}
			return disabled;
		}
	}

	modalErrorHandler() {
		let error = {};
		Config.accountNumbers.forEach((el) => {
			let notANumber = false;
			if (this.state.modalObj[el]) {
				if (isNaN(this.state.modalObj[el])) {
					error[el] = true;
				}
			}
		});
		let saveDisabled = this.modalDisableHandler(error);
		let modalObj = {...this.state.modalObj, saveDisabled: saveDisabled};
		//modalObj.saveDisabled = saveDisabled;
		this.setState({
			modalObj: modalObj,
			modalObjError: error
		});
	}

	modalSave() {
		let ajax;
		let data = {...this.state.modalObj};
		Config.accountNumbers.forEach((el) => {
			if (!this.state.modalObj[el]) {
				data[el] = 0;
			}
		});
		data.address = this.state.modalObj.address ? this.state.modalObj.address : null;
		data.remarks = this.state.modalObj.remarks ? this.state.modalObj.remarks : null;
		data.token = this.props.token;
		this.setState({
			modalDisable: true
		}, () => {
			if (this.state.modal === 'add') {
				ajax = AccountModel.rowSave(data);
			} else {
				ajax = AccountModel.rowUpdate(data);
			}
			ajax.then((response) => {
				let type = response.data.success ? 'success' : 'error';
				this.displayMessage(response.data.reason, type);
			}).catch((err) =>{
				this.displayMessage(Config.message.error, 'error');
			});
		});
	}

	openModal(action) {
		let list = [...this.props.account.list];
		let obj = {};
		if (action === 'modify') {
			let objCheck = list.findIndex((el) => { return parseInt(el.id) === parseInt(this.state.selectedRow) });
			if (objCheck !== -1) {
				obj = list[objCheck];
				obj.cashDate = obj.cashTime ? moment(obj.cashTime) : null;
				obj.receiptDate = obj.receiptTime ? moment(obj.receiptTime) : null;
				obj.saveDisabled = true;
			}
		} else {
			obj = {
				closed: -1,
				type: -1
			};
		}
		this.setState({
			modal: action,
			modalObj: obj
		});
	}

	selectChange(e) {
		let name = e.target.name;
		let value = e.target.value;
		let selected = {...this.state.selected};
		selected[name] = value;
		this.setState({
			selected: selected
		}, () => {
			this.getAccounts(true);
		});
	}

	selectRow(id) {
		let curSelected = null;
		let listCheck = this.props.account.list.findIndex((el) => { return el.id === id});
		if (this.state.selectedRow !== id && listCheck !== -1) {
			let closed = this.props.account.list[listCheck].closed;
			if (closed) {
				this.props.setWarning(Config.message.account.closed);
			} else {
				curSelected = id;
			}
		}
		this.setState({
			selectedRow: curSelected
		});
	}

	setDate(name, value) {
		let selected = {...this.state.selected};
		selected[name] = value;
		var createXml = selected.dateFrom !== null && selected.dateTo !== null;
		this.setState({
			createXml: createXml,
			selected: selected
		}, () => {
			this.getAccounts(true);
		});
	}

	setParams() {
		let params = {};
		let selected = this.state.selected;
		for (let el in this.state.selected) {
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
			let message = Config.message.account;
			obj.unshift(
				<option key={ -1 } value={ message.defaultOption.id }>{ message.defaultOption.name }</option>
			);
			return obj;
		};
		let data = this.props.account;
		let accountsHeader, accountsDetails, busy, header, message, messageStyle, modal, stateOptions, typeOptions;
		if (this.props.success) {
			messageStyle = "alert alert-success alertHeight textAlignCenter";
		} else if (this.props.error) {
			messageStyle = "alert alert-danger alertHeight textAlignCenter";
		}
		stateOptions = Config.accountStates.map((el, index) => {
			return (
				<option key={ index } value={ el.id }>{ el.name }</option>
			);
		});
		typeOptions = Config.accountTypes.map((el, index) => {
			return (
				<option key={ index } value={ el.id }>{ el.name }</option>
			);
		});
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
					message={Config.message}
					selected={this.state.selected}
					selectedRow={this.state.selectedRow}
					states={curStateOpt}
					types={curTypeOpt}
					xml={this.state.createXml}
				/>
			);
			if (this.state.inProgress) {
				busy = (
					<Busy title={Config.message.loading} />
				);
			}
			let empty;
			if (data.list) {
				empty = false;
			} else {
				empty = true;
			}
			accountsDetails = (
				<AccountDetail
					ascending={this.state.ascending}
					columns={Config.accountColumns}
					data={data}
					empty={empty}
					message={Config.message}
					selectedRow={this.state.selectedRow}
					selectRow={this.selectRow.bind(this)}
					sortTable={this.sortTable.bind(this)}
					sortBy={this.state.sortBy}
					types={Config.accountTypes}
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
						message={Config.message}
						modalMessage={this.state.modalMessage}
						numbers={Config.accountNumbers}
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
