import React from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { reactLocalStorage } from 'reactjs-localstorage';
import axios from 'axios';

import store from '../store.jsx';
import * as order from '../actions/orderActions.jsx';

import Busy from '../components/dumb/Busy.jsx';
import Config from '../Config.jsx';
import Header from '../components/dumb/Header.jsx';
import Message from '../components/dumb/Message.jsx';

import OrderDetail from '../components/order/OrderDetail.jsx';
import OrderHeader from '../components/order/OrderHeader.jsx';

@connect((store) => {
    return {
    	order: store.order
    };
})

export default class OrderContainer extends React.Component {
	constructor(props) {
		super(props);	 
		this.state = {
			action: undefined,
			clear: false,
			currentVoucher: null,
			curShipment: Config.message.orders.defaultShipmentNumber,
			db: undefined,
			disable: false,
			display: false,
			id: undefined,
			inProgress: false,
			panel: null,
			shipmentNumber: false
		}
	}

	componentDidMount() {
		this.props.unsubscribe();
	}

    componentWillUpdate(nextProps, nextState) {
    	if (nextProps.approved && nextProps.token) {
				if (nextProps.params.db === undefined && nextProps.params.id === undefined) {
					if (nextState.disable && !nextState.clear) {
						this.setState({
							clear: true,
							curShipment: Config.message.orders.defaultShipmentNumber,
							db: undefined,
							disable: false,
							id: undefined,
							shipmentNumber: false
						}, () => {
							store.dispatch(order.clearData());
							this.setState({
								clear: false
							});
						});
					}
				}
	    }
    }

		componentDidUpdate() {
			if (this.props.approved && this.props.token) {
				if (this.props.params.db !== undefined && this.props.params.id !== undefined) {
					this.checkUrl(this.props, this.state);
				}
			}
		}

    checkUrl(nextProps, nextState) {
    	let params = {};
			let curPromise;
    	let url;
    	let urlData = Config.url;
    	let token = nextProps.token;
    	let db = nextProps.params.db;
    	let id = nextProps.params.id;
    	let action = nextProps.params.action;
    	if (db !== this.state.db || id !== this.state.id || action !== this.state.action) {
    		this.setState({
    			action: action,
    			db: db,
					disable: true,
    			id: id,
    			inProgress: true
    		}, () => {
    			if (!action) {
    				url = urlData.serverPath + 'orders/' + db + '/' + id + '/' + token;
						curPromise = axios.get(url, { params });
						this.handlePromise(curPromise, action, db, id);
    			} else {
    				if (action === 'even') {
							url = urlData.serverPath + urlData.pathOrder + '/' + db + '/' + id + '/even';
							curPromise = axios.put(url, {}, Config.ajaxConfig);
							this.handlePromise(curPromise, action, db, id);
						} else if (action === 'discount' || action === 'mail') {
							url = urlData.serverPath + urlData.pathOrder + '/' + db + '/' + id + '/' + token + '?action=' + action;
							curPromise = axios.get(url, { params });
							this.handlePromise(curPromise, action, db, id);
						} else if (action === 'voucher') {
							url = urlData.serverPath + urlData.pathOrder + '/' + db + '/' + id;
							let params = { basic: true };
							axios.get(url, { params })
								.then((response) => {
									if (!response.data.customer) {
										throw new Error(response.data.reason);
									} else {
										let customerUrl = urlData.serverPath + 'customer/' + db + '/' + response.data.customer.id + '/vouchers/' + this.props.token;
										curPromise = axios.get( customerUrl, {} )
										this.handlePromise(curPromise, action, db, id);
									}
								})
								.catch((err) =>{
									let message = err.message || Config.message.error;
									this.props.setWarning(message);
								});
						}
    			}
    		});
    	}
    }

		handlePromise(curPromise, action, db, id) {
			curPromise
				.then((response) => {
					this.setState({
						inProgress: false
					}, () => {
						if (response.data.success !== false) {
							if (!action) {
								let data = {...response.data};
								data.id = id;
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
					});
				})
				.catch((err) =>{
					let message = err.message || Config.message.error;
					this.props.setWarning(message);
				});
		}

    searchOrder(data) {
    	let urlData = Config.url;
    	let action = data.action;
			if (action === "orderNew" || action === "orderOld" || action === 'remindNew' || action === 'remindOld') {
				let db = (action === 'orderNew' || action === 'remindNew') ? 'new' : 'old';
				let url = urlData.path + urlData.pathSuffix + urlData.pathOrder + '/' + db + '/' + data.id;
				if (action === 'remindNew' || action === 'remindOld') {
						url = url + '/mail';
				}
				window.location.href = url;
			} else {
				this.setState({
					chooseOrder: true
				}, () => {
					let url = urlData.path + urlData.pathSuffix + urlData.pathOrder + '/old/' + data.id + '/' + action;
						window.location.href = url;
				});
			}
    }

	sendEmail(number = null) {
		let action = this.props.params.action ? this.props.params.action : 'deliveryNumber';
		let db = this.props.params.db;
		let id = this.props.params.id;
		let urlData = Config.url;
		let url = urlData.serverPath + urlData.pathOrder + '/' + db + '/' + id + '/mail/' + this.props.token;
		let params = {
			action: action,
			result: 'send'
		};
		if (action === 'voucher') {
			params.action = 'voucher';
			params.voucherNumber = number;
		} else if (action === 'deliveryNumber') {
			params.deliveryNumber = number;
		} else if (action === 'mail') {
			params.action = 'undelivered';
		}
		axios.get(url, { params })
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
		let busy, details, header, message, messageStyle, orderHeader;
		if (this.props.success) {
		  	messageStyle = "alert alert-success alertHeight textAlignCenter";
	  	} else if (this.props.error) {
	  		messageStyle = "alert alert-danger alertHeight textAlignCenter";
	  	}
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
      				actions={Config.orderActions}
							clear={this.state.clear}
      				disable={this.state.disable}
      				message={Config.message}
      				panels={Config.orderPanels}
      				search={this.searchOrder.bind(this)}
      			/>
      		);
      		if (this.state.inProgress) {
    			busy = <Busy title={Config.message.loading} />;
    		}
				let curOrder = this.props.order;
    		if (!this.state.inProgress) {
    			details = (
    				<OrderDetail
							currentVoucher={this.state.currentVoucher}
							curShipment={this.state.curShipment}
    					details={this.props.order}
    					display={this.state.display}
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
