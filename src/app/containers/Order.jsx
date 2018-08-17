import React from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import store from '../store';
import * as order from '../actions/orderActions.jsx';
import Busy from '../components/dumb/Busy.jsx';
import Config from '../Config';
import Header from '../components/dumb/Header.jsx';
import Message from '../components/dumb/Message.jsx';
import OrderDetail from '../components/order/OrderDetail.jsx';
import OrderHeader from '../components/order/OrderHeader.jsx';
import OrderModel from '../model/orderModel.js';
import Email from '../classes/email';
import CustomerModel from '../model/customerModel.js';
import { checkDisabled } from '../functions/order/checkDisabled';
import { checkIfUrlChanged } from '../functions/order/checkIfUrlChanged';
import { removeUrl } from '../functions/order/removeUrl';
import { setContainer } from '../functions/jsx/order.jsx';
import { setUrl } from '../functions/order/setUrl';
import { Header as DefaultHeader, State } from '../helper/orderState';

@connect((store) => {
    return { order: store.order };
})

export default class OrderContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {...State};
		this.email = new Email(this.props.mainModel);
	}

	componentDidUpdate() {
		if (this.props.order.error) {
			this.props.mainModel.setMessage('warning', Config.error);
			store.dispatch(order.clearError());
		}
	}
	componentWillUpdate(nextProps, nextState) {
		let params = nextProps.params;
		if (nextState.urlCheck) {
			this.checkUrl();
			this.setState({urlCheck: false});
		} else if (this.state.checkDisabled) {
			this.checkDisabled();
			this.setState({checkDisabled: false});
		} else if (nextState.clear) {
			store.dispatch(order.clearData());
			this.setState({clear: false});
		} else if (nextProps.order.customerId && params.db && params.id) {
			let data = { db: params.db, id: nextProps.order.customerId, orderId: params.id, token: nextProps.token };
			store.dispatch(order.deleteCustomerId());
			store.dispatch(order.setAction('getCustomer', data));
		} else {
			let removedDb = params.db === undefined && this.props.params.db !== undefined;
			let removedId = params.id === undefined && this.props.params.id !== undefined;
			if (removedDb && removedId) {
				this.removeDb();
			}
			if (checkIfUrlChanged(params, this.props.params, nextProps.order, this.state.inProgress)) {
				this.setUrlCheck();
			}
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return (nextProps.approved && nextProps.token);
	}

	checkDisabled() {
		this.setState({ checkDisabled: false, headerDisable: checkDisabled(this.state.header, this.state.error) });
	}
	checkUrl() {
		const action = this.props.params.action;
		const db = this.props.params.db;
		const id = this.props.params.id;
		if (db && id && this.props.token) {
			store.dispatch(order.setLoading());
			if (!action || action !== 'voucher') {
				if (action === 'even') {
					store.dispatch(order.setAction('setEven', { db, id }));
				} else if (action === 'discount' || action === 'mail') {
					store.dispatch(order.setAction('setAdditionalAction', { action, db, id }));
				} else {
					store.dispatch(order.setAction('setOrder', { db, id, token: this.props.token }));
				}
			} else {
				store.dispatch(order.setAction('setVoucher', { db, id, token: this.props.token }));
			}
		}
	}

	removeDb = () => this.setState(removeUrl(this.state, DefaultHeader));

	searchOrder = (data) => window.location.href = setUrl(data);

	sendEmail = () => this.email.send(this.props.params, this.props.token);

	setHeaderData(data) {
		let error = data.updateError ? data.error : this.state.error;
		this.setState({ checkDisabled: true, error, header: data.header });
	}
	setDisplay(cover, bool) {
    	let curCover = bool !== false ? cover : false;
    	this.setState({ display: curCover });
	}
	setError(data) {
		this.props.mainModel.setMessage('warning', data.value + Config.notANumber);
		this.setState({ error: data });
	}
	setShipmentNumber = (e) => this.setState({ curShipment: e.target.value });

	setUrlCheck = () => this.setState({ disable: true, urlCheck: true });

	shipmentNumberHandler = () => this.setState({ shipmentNumber: !this.state.shipmentNumber });

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
			header = <Header active="orders" buttonHandler={this.props.logoutHandler.bind(this)} disable={this.state.disable} />;
			message = <Message message={this.props.toDisplay} messageStyle={messageStyle}/>;
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
						send={this.sendEmail.bind(this)}
						setDisplay={this.setDisplay.bind(this)}
						setShipmentNumber={this.setShipmentNumber.bind(this)}
						shipmentNumber={this.state.shipmentNumber}
						shipmentNumberHandler={this.shipmentNumberHandler.bind(this)}
						voucherChange={this.voucherChange.bind(this)}
					/>
				);
			}
		}
		return setContainer(header, message, orderHeader, busy, details);
	}
}
