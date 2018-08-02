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
import OrderModel from '../model/orderModel.js';
import CustomerModel from '../model/customerModel.js';
import { Header as DefaultHeader, State } from '../helper/orderState';

@connect((store) => {
    return { order: store.order };
})

export default class OrderContainer extends React.Component {
	constructor(props) {
		super(props);	 
		this.state = {...State};
	}

	componentDidUpdate() {
		if (this.props.order.error) {
			this.props.mainModel.setMessage('warning', Config.error);
			store.dispatch(order.clearError());
		} else if (this.state.clear) {
			store.dispatch(order.clearData());
		} else if (this.state.checkDisabled) {
			this.checkDisabled();
		} else if (this.state.urlCheck) {
			this.checkUrl();
		}
	}
	componentWillUpdate(nextProps, nextState) {
		if (nextProps.order.customerId && nextProps.params.db && nextProps.params.id) {
			store.dispatch(order.deleteCustomerId());
			store.dispatch(order.setAction('getCustomer', {
				db: nextProps.params.db,
				id: nextProps.order.customerId,
				orderId: nextProps.params.id,
				token: nextProps.token
			}));
		} else {
			let newParams = nextProps.params.db !== this.props.params.db || nextProps.params.id !== this.props.params.id;
			let newAction = nextProps.params.action !== this.props.params.action;
			//let noData = !nextProps.order.orderData && !this.props.order.orderData;
			let noData = !nextProps.order.orderData && !nextProps.order.additionalData;
			let paramsAvailable = nextProps.params.db !== undefined && nextProps.params.id !== undefined;
			let removedDb = nextProps.params.db === undefined && this.props.params.db !== undefined;
			let removedId = nextProps.params.id === undefined && this.props.params.id !== undefined;
			if (nextState.urlCheck) {
				this.setState({urlCheck: false});
			} else if (this.state.checkDisabled) {
				this.setState({checkDisabled: false});
			} else if (nextState.clear) {
				this.setState({clear: false});
			} else if (removedDb && removedId) {
				this.removeDb();
			} else if (noData && paramsAvailable && !nextProps.order.loading && !this.state.inProgress) {
				this.setUrlCheck();
			} else if ((newParams || newAction) && paramsAvailable) {
				this.setUrlCheck();
			}
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return (nextProps.approved && nextProps.token);
	}

	checkDisabled() {
		let curDisable = {
			action: true,
			panel: true
		};
		let name = this.state.header.name;
		let shortenName = name.replace('Id', '');
		let isNaNCheck = Boolean(isNaN(this.state.header[name]) || this.state.header[name] === '');
		if (this.state.header.selected[shortenName] !== 0 && !this.state.error[name] && !isNaNCheck) {
			curDisable[shortenName] = false;
		}
		this.setState({
			checkDisabled: false,
			headerDisable: curDisable
		});
	}
	checkUrl() {
		const action = this.props.params.action;
		const db = this.props.params.db;
		const id = this.props.params.id;
		const token = this.props.token;
		if (db && id && token) {
			store.dispatch(order.setLoading());
			if (!action || action !== 'voucher') {
				if (action === 'even') {
					store.dispatch(order.setAction('setEven', { db, id }));
				} else if (action === 'discount' || action === 'mail') {
					store.dispatch(order.setAction('setAdditionalAction', { action, db, id }));
				} else {
					store.dispatch(order.setAction('setOrder', { db, id, token }));
				}
			} else {
				store.dispatch(order.setAction('setVoucher', { db, id, token }));
			}
		}
	}
	removeDb() {
		this.setState({
			clear: true,
			curShipment: Config.message.orders.defaultShipmentNumber,
			db: undefined,
			disable: false,
			header: DefaultHeader,
			id: undefined,
			shipmentNumber: false
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
					this.props.mainModel.setMessage('success', response.data.reason);
				} else {
					throw new Error(response.data.reason);
				}
			})
			.catch((err) =>{
				let message = err.message || Config.message.error;
				this.props.mainModel.setMessage('warning', message);
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
    	this.setState({ display: curCover });
	}
	setError(data) {
		let message = data.value + Config.notANumber;
		this.props.mainModel.setMessage('warning', message);
		this.setState({ error: data });
	}
	setShipmentNumber(e) {
		this.setState({ curShipment: e.target.value });
	}
	setUrlCheck() {
		this.setState({
			disable: true,
			urlCheck: true
		});
	}
	shipmentNumberHandler() {
		let nextState = !this.state.shipmentNumber;
		this.setState({ shipmentNumber: nextState });
	}
	voucherChange(action, value) {
		if ((action === 'add' && value < 5) || (action === 'subtract' && value > 1)) {
			let number = action === 'add' ? value + 1 : value - 1;
			this.setState({ currentVoucher: number });
		} else if (action === 'add') {
			this.props.mainModel.setMessage('warning', Config.message.orders.voucherMax);
		} else if (action === 'subtract') {
			this.props.mainModel.setMessage('warning', Config.message.orders.voucherMin);
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
					disable={this.state.disable}
					error={this.state.error}
					header={this.state.header}
					headerDisable={this.state.headerDisable}
					search={this.searchOrder.bind(this)}
					setData={this.setHeaderData.bind(this)}
					setError={this.setError.bind(this)}
				/>
			);
			if (this.state.inProgress || this.props.order.loading) {
				busy = <Busy title={Config.message.loading} />;
			}
			if (!this.state.inProgress && !this.props.order.loading) {
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
