import React from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { reactLocalStorage } from 'reactjs-localstorage';

import store from '../store';
import * as product from '../actions/productActions.jsx';
import Config from '../Config';
import { clearUrl, setUrl } from '../helper/functions';
import Header from '../components/dumb/Header.jsx';
import Message from '../components/dumb/Message.jsx';
import BasicEdition from '../components/modal/BasicEdition.jsx';
import ProductEdition from '../components/product/ProductEdition.jsx';
import ProductHeader from '../components/product/ProductHeader.jsx';
import ProductHistory from '../components/product/ProductHistory.jsx';
import ProductList from '../components/product/ProductList.jsx';
import Modified from '../components/product/Modified.jsx';
import LastOrders from '../components/product/LastOrders.jsx';
import Printings from '../components/product/Printings.jsx';
import MainModel from '../model/mainModel';
import ProductModel from '../model/productModel';
import { Header as DefaultHeader, State } from '../helper/productState';

@connect((store) => {
    return {
    	category: store.product.categoryList,
	    manufactorer: store.product.manufacturerList,
    	product: store.product,
    	error_product: store.product.error,
    };
}) 

export default class ProductContainer extends React.Component {
	constructor(props) {
		super(props);	 
		this.state = State;
		this.subscription = ProductModel.newestOrdersInterval.subscribe(() => this.checkNewestOrders());
	}

	componentDidUpdate() {
		let action = this.state.action;
		if (!this.state.componentChecked) {
			this.checkComponent();
		} else if (action && action !== 'checkUrl') {
			this[action]();
		}
	}
	componentWillUnmount() {
		this.subscription.unsubscribe();
	}
	componentWillUpdate(nextProps, nextState) {
		this.setDisabled(nextProps, nextState);
		if (nextState.componentChecked) {
			if (nextState.action === 'checkUrl') {
				this.checkUrl(nextProps, nextState);
			} else if (nextState.action) {
				this.setState({ action: null });
			}
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return (nextProps.approved && nextProps.token);
	}

	checkComponent() {
		this.clearData();
		this.getConstant();
		this.setState({
			action: 'checkUrl',
			componentChecked: true
		});
	}
	checkUrl(nextProps, nextState) {
		if (nextProps.params.action !== undefined && nextProps.params.id !== undefined) {
			let action = nextProps.params.action;
			let edition = action === 'edition' && nextState.editionSearched !== nextProps.params.id;
			let history = action === 'history' && nextState.historySearched !== nextProps.params.id;
			if (edition || history) {
				store.dispatch(product.clearData());
				let currentAction = action === 'edition' ? 'searchId' : 'searchHistory';
				let editionSearched = edition ? nextProps.params.id : false;
				let historySearched = history ? nextProps.params.id : false;
				this.setState({
					action: currentAction,
					editionSearched: editionSearched,
					historySearched: historySearched,
					searching: true,
					simpleSearched: false
				});
			}
		} else {
			if (nextState.restoreList) {
				this.setState({
					action: 'restoreList',
					editionSearched: false,
					restoreList: false
				});
			} else if (nextState.editionSearched || nextState.historySearched) {
				this.setState({
					action: 'clearData',
					editionSearched: false,
					historySearched: false,
				});
			}
		}
	}
	checkModified() {
		ProductModel.getModyfied()
			.then((response) => {
				if (response.status === 200 && response.data[0]) {
					var data = {
						empty: false,
						list: response.data,
					};
				} else if (response.status === 200 && !response.data[0]) {
					var data = {
						empty: true,
						list: null,
					};
				}
				store.dispatch(product.setModified(data));
				this.checkNewestOrders();
			})
			.catch((err) =>{
				this.props.setWarning(err.message);
			})
			.finally(() => {
				this.setState({
					action: 'checkPrintings',
					modifiedSearch: false,
					printingSearch: true
				});
			});
	}
	checkNewestOrders() {
		store.dispatch(product.setOrdersSearch());
		let url = setUrl('pathOrder', 'last', this.props.token);
		store.dispatch(product.setAction('setLastOrders', url));
	}
	checkPrintings() {
		let promise = ProductModel.getPrintings(this.props.token);
		this.setPrintings(promise);
		this.setState({ action: 'checkUrl' });
	}
	clearData(button = null) {
		reactLocalStorage.set('categorySearch', null);
		reactLocalStorage.set('manufactorerSearch', null);
		reactLocalStorage.set('nameSearch', null);
		store.dispatch(product.clearData());
		let modified, modifiedSearch;
		if(!this.state.modified) {
			this.checkModified();
			modified = true;
			modifiedSearch = true;
		} else {
			modified = this.state.modified;
			modifiedSearch = false;
			if (button) {
				store.dispatch(product.clearInputs(true));
			}
		}
		this.setState({
			action: 'checkUrl',
			header: DefaultHeader,
			modified: modified,
			modifiedSearch: modifiedSearch,
			nameSearch: false
		});
	}

	clearEdition() {
		this.setState({
			action: 'clearUrl',
			restoreList: true
		});
	}
	clearUrl() {
		clearUrl(Config.url.pathProducts);
		this.setState({ action: 'checkUrl' });
	}
	closeModal() {
		this.setState({ simpleSearched: false });
	}
	deleteModified(id) {
		ProductModel.deleteModified(id, this.props.token)
		.then((response) => {
			if (response.status === 200 && response.data.success) {
				this.props.setSuccess(response.data.reason);
				this.checkModified();
			} else {
				throw new Error(response.data.reason);
			}
		}).catch((err) =>{
			store.dispatch(product.setError(err));
		});
	}
	getConstant() {
		var cached = reactLocalStorage.getObject('constant');
		if (cached !== undefined && cached.category !== undefined && cached.manufactorer !== undefined) {
			let data = {
				category: cached.category,
				manufactorer: cached.manufactorer,
			};
			store.dispatch(product.setConstant(data));
			this.setState({ constant: true });
		} else {
			var category = ProductModel.getCategories();
			var manufactorer = ProductModel.getManufactorer();
			reactLocalStorage.setObject('constant', {'category': category, 'manufactorer': manufactorer});
			Promise.all([category, manufactorer])
			.then(response => { 
				if (response[0].status === 200 && response[1].status === 200) {
					let data = {
						category: response[0].data,
						manufactorer: response[1].data,
					};
					reactLocalStorage.setObject('constant', {'category': response[0].data, 'manufactorer': response[1].data});
					store.dispatch(product.setConstant(data));
					this.setState({ constant: true });
				} else {
					throw new Error(response[0].data.reason);
				}
			})   
			.catch((err) =>{
			    store.dispatch(product.setError(err));
			});
		}
	}
	handleHistory() {
		this.state.promise
			.then((response) => {
				if (response.status === 200 && response.data) {
					store.dispatch(product.setHistory(response.data, this.state.historySearched));
				} else {
					throw new Error(response.data.reason);
				}
			})
			.catch((err) =>{
				store.dispatch(product.setError(err.message));
			})
			.finally(() => {
				this.setState({
					action: 'checkUrl',
					disable: true,
					promise: null,
					searching: false
				});
			});
	}
	handleSearch() {
		this.state.promise
			.then((response) => {
				if (response.status === 200) {
					if (this.state.editionSearched) {
						let respData = {
							edition: 'full',
							first: response.data,
							second: null,
						};
						store.dispatch(product.setIdResult(respData));
					} else if (this.state.simpleSearched) {
						store.dispatch(product.setBasicData(response.data));
					}
				} else {
					throw new Error(response.data.reason);
				}
			})
			.catch((err) =>{
				this.props.setWarning(Config.message.error);
			})
			.finally(() => {
				this.setState({
					action: 'checkUrl',
					disable: true,
					promise: null,
					searching: false
				});
			});
	}
	modifyLastOrder(base, id) {
		ProductModel.modifyLastOrder(base, id, this.props.token)
			.then((response) => {
				if (response.data.success) {
					this.props.setSuccess(response.data.reason);
					this.props.searchOrders();
				} else {
					throw new Error(response.data.reason);
				}
			})
			.catch((err) =>{
				store.dispatch(product.setError(err));
			});
	}
	nameSearch() {
		let data = this.state.nameSearchData;
		let promise = ProductModel.nameSearch(data);
		this.setNameData(promise, data);
		this.setState({ action: 'checkUrl' });
	}
	redirect(path, id) {
		let url = Config.url.path + Config.url.pathSuffix + Config.url.pathProducts + '/' + path + '/' + id;
		window.location = url;
	}
	restoreList() {
		let data = {
			category: reactLocalStorage.get('categorySearch'),
			manufactorer: reactLocalStorage.get('manufactorerSearch'),
			search: reactLocalStorage.get('nameSearch')
		};
		this.setNameSearch(data);
	}
	saveProduct() {
		let data = {...this.state.saveData};
		if (data.quantity.modified !== undefined) {
			var curQuantity = data.quantity.modified;
		} else if (data.quantity.old !== undefined) {
			var curQuantity = data.quantity.old;
		} else {
			var curQuantity = data.quantity;
		}
		data.quantity = curQuantity;
		window.scrollTo(0, 0);
		let newAttr = this.props.product.fullDataFirst.attribute.new;
		let oldAttr = this.props.product.fullDataFirst.attribute.old;
		ProductModel.saveProduct(newAttr, oldAttr, this.state.config, data)
			.then((response) => {
				let action = response.data.success ? 'setSuccess' : 'setWarning';
				this.props[action](response.data.reason);
				this.checkModified();
			})
			.catch((err) =>{
				this.props.setWarning(Config.message.error);
			})
			.finally(() => {
				this.setState({ disabledEdition: false });
			});
	}
	searchId() {
		store.dispatch(product.prepareResult());
		let promise = ProductModel.searchId(this.state.editionSearched, this.state.simpleSearched);
		this.setState({
			action: 'handleSearch',
			promise: promise
		});
	}
	searchHistory(state = null) {
		let curState = state ? state : this.state;
		store.dispatch(product.prepareResult());
		let promise = ProductModel.searchHistory(curState.historySearched);
		this.setState({
			action: 'handleHistory',
			promise: promise
		});
	}
	setDisabled(props, state) {
		let disabled = !state.constant || (props.params.action !== undefined && props.params.id !== undefined);
		//if (disabled !== this.state.disable) {
		if (disabled !== state.disable) {
			this.setState({ disable: disabled });
		}
	}
	setError(error) {
		this.props.setError(error);
	}
	setHeader(data) {
		let curData = {...data};
		if (curData.origin === 'idSearch') {
			this.setSimpleId({ id: curData.productId });
		} else if (data.origin === 'avoidName') {
			curData.productName = this.state.header.productName;
		}
		this.setState({ header: curData });
	}
	setNameData(promise, data) {
		promise
			.then((response) => {
				if (response.status === 200 && response.data) {
					if (response.data.success !== undefined) {
						var finalData = {empty: true, reason: response.data.reason};
					} else {
						reactLocalStorage.set('categorySearch', data.category);
						reactLocalStorage.set('manufactorerSearch', data.manufactorer);
						reactLocalStorage.set('nameSearch', data.search);
						var finalData = {
							list: response.data,
							anotherSearch: Boolean(data.anotherSearch),
						};
					}
					store.dispatch(product.setNameResult(finalData));
				} else {
					throw new Error(response.data.reason);
				}
			})
			.catch((err) =>{
				store.dispatch(product.setError(err));
			})
			.finally(() => {
				this.setState({ searching: false });
			});
	}
	setNameSearch(data) {
		this.setState({
			action: 'nameSearch',
			nameSearch: true,
			nameSearchData: data,
			searching: true
		});
	}
	setPrintings(promise) {
		promise
			.then((response) => {
				if (response.status === 200 && response.data.success) {
					let ajaxResponse = response.data;
					let data = {
						deliveryList: ajaxResponse.deliveryList,
						list: ajaxResponse.list || null,
						empty: ajaxResponse.empty,
						emptyDelivery: ajaxResponse.emptyDelivery || null
					};
					store.dispatch(product.setPrintings(data));
				} else {
					throw new Error(response.data.reason);
				}
			})
			.catch((err) =>{
				this.props.setWarning(err.message);
			})
			.finally(() => {
				this.setState({
					printingSearch: false
				});
			});
	}
	setSave(data) {
		this.setState({
			action: 'saveProduct',
			disabledEdition: true,
			saveData: data
		});
	}
	setSimpleId(data) {
		this.setState({
			action: 'searchId',
			editionSearched: false,
			historySearched: false,
			simpleSearched: parseInt(data.id)
		});
	}
	setSuccess(message) {
		this.props.setSuccess(message);
	}
	
	render() {
		let header, message, lastOrders, printings;
		let messageStyle = this.props.success ? Config.alertSuccess : Config.alertError;
		if (this.props.approved) {
			let linkDisable = this.state.modifiedSearch || this.state.printingSearch;
			header = (
				<div class="height12">
					<Header
						active="products"
						buttonHandler={this.props.logoutHandler.bind(this)}
						disable={this.state.disable}
						fields={Config.fields}
						linkDisable={linkDisable}
					/>
				</div>
			);
			message = (
				<Message
					message={this.props.toDisplay}
					messageStyle={messageStyle}
				/>
			);
		}
		let basic, edition, history, modified, nameList;
		if (!this.state.editionSearched && !this.state.historySearched && !this.state.nameSearch) {
			modified = (
				<Modified
					list={this.props.product.modifiedList}
					delete={this.deleteModified.bind(this)}
					disable={this.state.disable}
					inSearch={this.state.modifiedSearch}
				/>
			);
			lastOrders = (
				<LastOrders
					data={this.props.product.lastOrders}
					inSearch={this.props.product.ordersSearch}
					setLastOrder={this.modifyLastOrder.bind(this)}
				/>
			);
			printings = (
				<Printings
					data={this.props.product.printings}
					getPrintings={this.checkPrintings.bind(this)}
					inSearch={this.state.printingSearch}
					setError={this.setError.bind(this)}
					setSuccess={this.setSuccess.bind(this)}
					token={this.props.token}
				/>
			);
		} else if (this.state.editionSearched && !this.state.historySearched) {
			edition = (
				<ProductEdition
					dataFull={this.props.product.fullDataFirst}
					disable={this.state.disabledEdition}
					id={this.state.editionSearched}
					imageDisplay={this.state.imageDisplay}
					goBack={this.clearEdition.bind(this)}
					list={this.state.nameSearch}
					message={Config.message}
					modified={this.props.product.modifiedList}
					save={this.setSave.bind(this)}
					url={Config.url}
				/>
			)
		} else if (!this.state.editionSearched && this.state.historySearched) {
			history = (
				<ProductHistory
					clear={this.clearData.bind(this)}
					id={this.state.editionSearched}
					product={this.props.product}
				/>
			)
		} else if (this.state.nameSearch && !this.state.editionSearched && !this.state.historySearched) {
			nameList = (
				<ProductList
					clearList={this.clearData.bind(this)}
					product={this.props.product}
					redirect={this.redirect.bind(this)}
					searching={this.state.searching}
					simpleModal={this.setSimpleId.bind(this)}
				/>
			)
		}
		if (this.state.simpleSearched) {
			basic = (
				<BasicEdition
					ajaxConfig={Config.ajaxConfig}
					close={this.closeModal.bind(this)}
					dataBasic={this.props.product.basicData}
					dataReceived={this.props.product.dataReceived}
					token={this.props.token}
				/>
			)
		}
		let searchedCheck = this.state.editionSearched || this.state.historySearched;
		let productHeader = (
			<ProductHeader
				category={this.props.category}
				constant={this.state.constant}
				data={this.state.header}
				disable={this.state.disable}
				error={this.state.error}
				manufactorer={this.props.manufactorer}
				searched={searchedCheck}
				searchName={this.setNameSearch.bind(this)}
				setHeader={this.setHeader.bind(this)}
			/>
		);
		let padding = 'paddingBottom2';
			return (
				<div class={padding}>
					{header}
					{message}
					{productHeader}
					{basic}
					{edition}
					{history}
					{nameList}
					{modified}
					{lastOrders}
					{printings}
		    </div>
	    )
    }
}
