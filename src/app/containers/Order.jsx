import React from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { reactLocalStorage } from 'reactjs-localstorage';

import store from '../store';
import * as order from '../actions/orderActions.jsx';
import Busy from '../components/dumb/Busy.jsx';
import Config from '../Config';
import Header from '../components/dumb/Header.jsx';
import Message from '../components/dumb/Message.jsx';
import OrderDetail from '../components/order/OrderDetail.jsx';
import OrderHeader from '../components/order/OrderHeader.jsx';
import OrderModel from '../model/orderModel.jsx';
import CustomerModel from '../model/customerModel.jsx';
import { State } from '../helper/orderState';

@connect((store) => {
    return { order: store.order };
})

export default class OrderContainer extends React.Component {
	constructor(props) {
		super(props);	 
		this.state = State;
	}

	componentDidMount() {
		this.props.unsubscribe();
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.approved && nextProps.token) {
			let changedDb = nextProps.params.db === undefined && this.props.params.db !== undefined;
			let changedId = nextProps.params.id === undefined && this.props.params.id !== undefined;
			let newParams = nextProps.params.db !== this.props.params.db && nextProps.params.id !== this.props.params.id;
			let paramsAvailable = nextProps.params.db !== undefined && nextProps.params.id !== undefined;
			if (changedDb && changedId) {
				if (this.state.disable) {
					this.setState({
						clear: true,
						curShipment: Config.message.orders.defaultShipmentNumber,
						db: undefined,
						disable: false,
						id: undefined,
						shipmentNumber: false
					});
				}
			} else if (nextState.clear) {
				store.dispatch(order.clearData());
				this.setState({
					clear: false
				});
			} else if (!this.state.checkDisabled && nextState.checkDisabled) {
				this.checkDisabled(nextState);
			} else if (!this.state.promise && nextState.promise) {
				this.setData(nextState.promise, nextProps);
			} else if (newParams && paramsAvailable) {
				this.setState({
					disable: true,
					inProgress: true,
					urlCheck: true
				});
			} else if (nextState.urlCheck && paramsAvailable) {
				this.checkUrl(nextProps);
			}
		}
	}

	checkDisabled(state) {
		console.log('inside checkDIsabled');
		let curDisable = {
			action: true,
			panel: true
		};
		let shortenName = state.header.name.replace('Id', '');
		let isNaNCheck = Boolean(isNaN(state.header[name]) || state.header[name] === '');
		if (state.header.selected[shortenName] !== 0 && !state.error[name] && !isNaNCheck) {
			curDisable[shortenName] = false;
		}
		this.setState({
			checkDisabled: false,
			headerDisable: curDisable
		});
	}
	checkUrl(props) {
		let curPromise, url;
		let token = props.token;
		let db = props.params.db;
		let id = props.params.id;
		let action = props.params.action;
		if (db !== this.state.db || id !== this.state.id || action !== this.state.action) {
			if (!action || action !== 'voucher') {
				if (action === 'even') {
					curPromise = OrderModel.evenData(db, id);
				} else if (action === 'discount' || action === 'mail') {
					curPromise = OrderModel.getDiscountOrMail(action, db, id, token);
				} else {
					curPromise = OrderModel.getData(db, id, token);
				}
				this.handlePromise(curPromise, action, db, id);
			} else {
				OrderModel.getVoucher(db, id).then((response) => {
					if (!response.data.customer) {
						throw new Error(response.data.reason);
					} else {
						curPromise = CustomerModel.getCustomerById(db, response.data.customer.id, this.props.token);
						this.handlePromise(curPromise, action, db, id);
					}
				}).catch((err) =>{
					let message = err.message || Config.message.error;
					this.props.setWarning(message);
				}).finally(() => {
					this.setState({
						urlCheck: false
					});
				});
			}
		}
	}
	handlePromise(curPromise) {
		this.setState({
			promise: curPromise,
			urlCheck: false
		});
	}
	searchOrder(data) {
		let url;
		let urlData = Config.url;
		let action = data.action;
		if (action === "orderNew" || action === "orderOld" || action === 'remindNew' || action === 'remindOld') {
			let db = (action === 'orderNew' || action === 'remindNew') ? 'new' : 'old';
			url = urlData.path + urlData.pathSuffix + urlData.pathOrder + '/' + db + '/' + data.id;
			if (action === 'remindNew' || action === 'remindOld') {
				url = url + '/mail';
			}
		} else {
			url = urlData.path + urlData.pathSuffix + urlData.pathOrder + '/old/' + data.id + '/' + action;
		}
		window.location.href = url;
	}
	sendEmail() {
		let action = this.props.params.action ? this.props.params.action : 'deliveryNumber';
		OrderModel.sendEmail(action, this.props.params.db, this.props.params.id, this.props.token)
			.then((response) => {
				if (response.data.success) {
					this.props.setSuccess(response.data.reason);
				} else {
					throw new Error(response.data.reason);
				}
			})
			.catch((err) =>{
				let message = err.message || Config.message.error;
				this.props.setWarning(message);
			});
	}
	setData(promise, props) {
		let action = props.params.action;
		let db = props.params.db;
		let id = props.params.id;
		promise
			.then((response) => {
				if (response.data.success !== false) {
					if (!action) {
						let data = {...response.data, id: id};
						store.dispatch(order.setOrderId(data, db));
					} else {
						let dataObj = {
							action: action,
							data: response.data,
							db: db,
							id: id
						};
						store.dispatch(order.setAdditional(dataObj));
					}
				} else {
					throw new Error(response.data.reason);
				}
			}).catch((err) =>{
			let message = err.message || Config.message.error;
			this.props.setWarning(message);
		}).finally(() => {
			this.setState({
				inProgress: false,
				promise: null
			});
		});
	}
	setHeaderData(data) {
		let error = data.updateError ? data.error : this.state.error;
		this.setState({
			checkDisabled: true,
			error: error,
			header: data.header
		});
	}
	setDisplay(cover, bool) {
    	let curCover = bool !== false ? cover : false;
    	this.setState({
    		display: curCover,
    	});
	}
	setShipmentNumber(e) {
		this.setState({
			curShipment: e.target.value
		});
	}
	shipmentNumberHandler() {
			let nextState = !this.state.shipmentNumber;
			this.setState({
				shipmentNumber: nextState
			});
	}
	voucherChange(action, value) {
		if ((action === 'add' && value < 5) || (action === 'subtract' && value > 1)) {
			let number = action === 'add' ? value + 1 : value - 1;
			this.setState({
				currentVoucher: number
			});
		} else if (action === 'add') {
			this.props.setWarning(Config.message.orders.voucherMax);
		} else if (action === 'subtract') {
			this.props.setWarning(Config.message.orders.voucherMin);
		}
	}

	render() {
		let busy, details, header, message, orderHeader;
		let empty = this.props.params.db === undefined && this.props.params.id === undefined;
		let messageStyle = this.props.success ? Config.alertSuccess : Config.alertError;
		if (this.props.approved) {
			header = (
				<div class="height12">
					<Header
						active="orders"
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
			orderHeader = (
				<OrderHeader
					clear={this.state.clear}
					disable={this.state.disable}
					error={this.state.error}
					header={this.state.header}
					headerDisable={this.state.headerDisable}
					search={this.searchOrder.bind(this)}
					setData={this.setHeaderData.bind(this)}
				/>
			);
			if (this.state.inProgress) {
				busy = <Busy title={Config.message.loading} />;
			}
			if (!this.state.inProgress) {
				details = (
					<OrderDetail
						currentVoucher={this.state.currentVoucher}
						curShipment={this.state.curShipment}
						details={this.props.order}
						display={this.state.display}
						empty={empty}
						images={Config.images}
						message={Config.message}
						send={this.sendEmail.bind(this)}
						setDisplay={this.setDisplay.bind(this)}
						setShipmentNumber={this.setShipmentNumber.bind(this)}
						shipmentNumber={this.state.shipmentNumber}
						shipmentNumberHandler={this.shipmentNumberHandler.bind(this)}
						url={Config.url}
						voucherChange={this.voucherChange.bind(this)}
					/>
				);
			}
		}
		return (
			<div>
				{header}
				{message}
				{orderHeader}
				{busy}
				{details}
			</div>
		)
	}
}
