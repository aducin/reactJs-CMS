import React from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { reactLocalStorage } from 'reactjs-localstorage';

import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/switchMap';
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
    	product: store.product
    };
}) 

export default class ProductContainer extends React.Component {
	constructor(props) {
		super(props);
		this.model = new ProductModel();
		this.state = State;
		this.subscription;
	}

	componentDidMount() {
		this.model.customSearch.switchMap(observable => observable)
			.subscribe((data) => this.setNameData(data)),
			(err) => this.props.mainModel.setMessage('warning', err.message);
		this.model.historySearch.switchMap(observable => observable)
			.subscribe((data) => this.handleHistory(data)),
			(err) => this.props.mainModel.setMessage('warning', err.message);
		this.model.idSearch.switchMap(observable => observable)
			.subscribe((data) => this.handleSearch(data)),
			(err) => this.props.mainModel.setMessage('warning', err.message);
		this.model.productSave.concatMap(observable => observable)
			.subscribe((data) => this.handleSave(data)),
			(err) => this.props.mainModel.setMessage('warning', err.message);
		this.model.searching.subscribe((bool) => this.setState({ searching: bool }));
		this.subscription = this.model.newestOrdersInterval.subscribe(() => this.checkNewestOrders());
	}

	componentDidUpdate() {
		let action = this.state.action;
		if (!this.state.componentChecked) {
			this.checkComponent();
		} else if (action) {
			this[action]();
		}
	}
	componentWillUnmount() {
		this.subscription.unsubscribe();
	}
	componentWillUpdate(nextProps, nextState) {
		this.setDisabled(nextProps, nextState);
		if (nextState.componentChecked) {
			this.checkUrl(nextProps, nextState);
			if (nextState.action) {
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
		this.setState({ componentChecked: true });
	}
	checkUrl(nextProps, nextState) {
		if (nextProps.params.action !== undefined && nextProps.params.id !== undefined) {
			let action = nextProps.params.action;
			let edition = action === 'edition' && nextState.editionSearched !== nextProps.params.id;
			let history = action === 'history' && nextState.historySearched !== nextProps.params.id;
			if (edition || history) {
				store.dispatch(product.clearData());
				let currentAction = action === 'edition' ? 'searchEdition' : 'searchHistory';
				let editionSearched = edition ? nextProps.params.id : false;
				let historySearched = history ? nextProps.params.id : false;
				this.setState({
					action: currentAction,
					editionSearched: editionSearched,
					historySearched: historySearched,
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
		this.model.getModyfied()
			.then((response) => {
				if (response.status === 200 && response.data[0]) {
					var data = {
						empty: false,
						list: response.data
					};
				} else if (response.status === 200 && !response.data[0]) {
					var data = {
						empty: true,
						list: null
					};
				}
				store.dispatch(product.setModified(data));
				this.checkNewestOrders();
			})
			.catch((err) =>{
				this.props.mainModel.setMessage('warning', err.message);
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
		this.setPrintings(this.model.getPrintings(this.props.token));
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
	}
	closeModal() {
		this.setState({ simpleSearched: false });
	}
	deleteModified(id) {
		this.model.deleteModified(id, this.props.token)
		.then((response) => {
			if (response.status === 200 && response.data.success) {
				this.props.mainModel.setMessage('success', response.data.reason);
				this.checkModified();
			} else {
				throw new Error(response.data.reason);
			}
		}).catch((err) =>{
			store.dispatch(product.setError(err));
		});
	}
	getConstant() {
		let cached = reactLocalStorage.getObject('constant');
		if (cached !== undefined && cached.category !== undefined && cached.manufactorer !== undefined) {
			let data = {
				category: cached.category,
				manufactorer: cached.manufactorer,
			};
			store.dispatch(product.setConstant(data));
			this.setState({ constant: true });
		} else {
			const category = this.model.getCategories();
			const manufactorer = this.model.getManufactorer();
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
	handleHistory(response) {
		if (response.status === 200 && response.data) {
			store.dispatch(product.setHistory(response.data, this.state.historySearched));
		} else {
			this.props.mainModel.setMessage('warning', response.data.reason);
		}
		this.setState({ disable: true });
	}
	handleSave(response) {
		window.scrollTo(0, 0);
		let action = response.data.success ? 'setSuccess' : 'setWarning';
		this.props.mainModel.setMessage(action, response.data.reason);
		this.checkModified();
		this.setState({ disabledEdition: false });
	}
	handleSearch(response) {
		if (response.status === 200) {
			if (this.state.editionSearched) {
				let respData = {
					edition: 'full',
					first: response.data,
					second: null
				};
				store.dispatch(product.setIdResult(respData));
			} else if (this.state.simpleSearched) {
				store.dispatch(product.setBasicData(response.data));
			}
		} else {
			this.props.mainModel.setMessage('warning', response.data.reason);
		}
		this.setState({ disable: true });
	}
	modifyLastOrder(base, id) {
		this.model.modifyLastOrder(base, id, this.props.token)
			.then((response) => {
				if (response.data.success) {
					this.props.mainModel.setMessage('success', response.data.reason);
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
		this.model.nameSearch(this.state.nameSearchData);
	}
	redirect(path, id) {
		window.location = Config.url.path + Config.url.pathSuffix + Config.url.pathProducts + '/' + path + '/' + id;
	}
	restoreList() {
		this.setNameSearch({
			category: reactLocalStorage.get('categorySearch'),
			manufactorer: reactLocalStorage.get('manufactorerSearch'),
			search: reactLocalStorage.get('nameSearch')
		});
	}
	searchEdition() {
		store.dispatch(product.prepareResult());
		this.model.searchId(this.state.editionSearched, null);
	}
	searchHistory(state = null) {
		store.dispatch(product.prepareResult());
		let curState = state ? state : this.state;
		this.model.searchHistory(curState.historySearched);
	}
	setDisabled(props, state) {
		let disabled = !state.constant || (props.params.action !== undefined && props.params.id !== undefined);
		if (disabled !== state.disable) {
			this.setState({ disable: disabled });
		}
	}
	setError(error) {
		this.props.setError(error);
	}
	setHeader(data) {
		if (data.origin === 'idSearch') {
			this.setSimpleId({ id: data.productId });
		} else if (data.origin === 'avoidName') {
			data.productName = this.state.header.productName;
		}
		this.setState({ header: data });
	}
	setNameData(response) {
		let data = this.state.nameSearchData;
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
			this.props.mainModel.setMessage('warning', response.data.reason);
		}
	}
	setNameSearch(data) {
		this.model.nameSearch(data);
		this.setState({
			nameSearch: true,
			nameSearchData: data
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
				this.props.mainModel.setMessage('warning', err.message);
			})
			.finally(() => {
				this.setState({ printingSearch: false });
			});
	}
	setSave(data) {
		let curQuantity;
		if (data.quantity.modified !== undefined) {
			curQuantity = data.quantity.modified;
		} else if (data.quantity.old !== undefined) {
			curQuantity = data.quantity.old;
		} else {
			curQuantity = data.quantity;
		}
		data.quantity = curQuantity;
		let newAttr = this.props.product.fullDataFirst.attribute.new;
		let oldAttr = this.props.product.fullDataFirst.attribute.old;
		this.model.saveProduct(newAttr, oldAttr, this.state.config, data);
		this.setState({ disabledEdition: true });
	}
	setSimpleId(data) {
		store.dispatch(product.prepareResult());
		this.model.searchId(null, parseInt(data.id));
		this.setState({
			editionSearched: false,
			historySearched: false,
			simpleSearched: parseInt(data.id)
		});
	}
	setSuccess(message) {
		this.props.mainModel.setMessage('success', response.data.reason);
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
					modified={this.props.product.modifiedList}
					save={this.setSave.bind(this)}
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
