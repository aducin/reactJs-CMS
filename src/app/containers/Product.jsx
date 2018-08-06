import React from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import store from '../store';
import * as product from '../actions/productActions.jsx';
import Config from '../Config';
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
import ProductModel from '../model/productModel';
import { clearUrl } from '../functions/clearUrl';
import { setUrl } from '../functions/setUrl';
import { checkUrl } from '../functions/product/checkUrl';
import { clearStorage } from '../functions/product/clearStorage';
import { getCachedLists } from '../functions/product/getCachedLists';
import { getPromises } from '../functions/product/getPromises';
import { getStorage } from '../functions/product/getStorage';
import { setModified } from '../functions/product/setModified';
import { setQuantity } from '../functions/product/setQuantity';
import { setStorage, setStorageConstant, setStorageSimple } from '../functions/product/setStorage';
import { Header as DefaultHeader, State } from '../helper/productState';

@connect((store) => {
    return { product: store.product };
})

export default class ProductContainer extends React.Component {
	constructor(props) {
		super(props);
		this.model = new ProductModel();
		this.state = State;
		this.subscription = this.model.newestOrdersInterval.subscribe(() => this.checkNewestOrders());
	}

	componentDidUpdate() {
		if (!this.state.componentChecked) {
			this.checkComponent();
		} else if (this.state.action) {
			this[this.state.action]();
		}
	}
	componentWillUnmount() { this.subscription.unsubscribe() }
	componentWillUpdate(nextProps, nextState) {
		this.setDisabled(nextProps, nextState);
		if (nextProps.product.error) {
			this.props.mainModel.setMessage('warning', Config.error);
			store.dispatch(product.clearError());
			this.setState({ disable: false });
		} else if (nextState.componentChecked) {
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
		this.clear();
		this.getConstant();
		this.setState({ componentChecked: true });
	}
	checkUrl(nextProps, nextState) {
		let act = checkUrl(nextProps, nextState);
		if (act.modify) {
			if (act.dispatch) {
				store.dispatch(product[act.dispatch]());
			}
			this.setState({
				action: act.action,
				editionSearched: act.editionSearched,
				historySearched: act.historySearched,
				restoreList: act.restoreList,
				simpleSearched: act.simpleSearched
			});
		}
	}
	checkModified() {
		let data;
		this.model.getModyfied()
			.then((response) => {
				if (response.status === 200 && response.data[0]) {
					data = { empty: false, list: response.data };
				} else if (response.status === 200 && !response.data[0]) {
					data = { empty: true, list: null };
				}
				store.dispatch(product.setModified(data));
				this.checkNewestOrders();
			})
			.catch((err) => this.props.mainModel.setMessage('warning', err.message))
			.finally(() => this.setState({ modifiedSearch: false, printingSearch: true }));
	}
	checkNewestOrders() {
		store.dispatch(product.setOrdersSearch());
		store.dispatch(product.setAction('setLastOrders', setUrl('pathOrder', 'last', this.props.token)));
	}
	clear(button = null) {
		clearStorage();
		store.dispatch(product.clearData());
		if (button) {
			store.dispatch(product.clearInputs(true));
		}
		if (!this.state.modified) {
			this.checkModified();
		}
		let mods = setModified(this.state.modified);
		this.setState({ header: DefaultHeader, modified: mods[0], modifiedSearch: mods[1], nameSearch: false});
	}
	clearEdition() {
		this.setState({ action: 'clearUrl', restoreList: true });
	}
	clearUrl() {
		clearUrl(Config.url.pathProducts);
	}
	closeModal() {
		this.setState({ simpleSearched: false });
	}
	deleteMods(id) {
		this.model.deleteModified(id, this.props.token)
		.then((response) => {
			if (response.status === 200 && response.data.success) {
				this.props.mainModel.setMessage('success', response.data.reason);
				this.checkModified();
			} else {
				throw new Error(response.data.reason);
			}
		}).
		catch((err) =>this.props.mainModel.setMessage('warning', err.message));
	}
	getConstant() {
		let cachedLists = getCachedLists();
		if (cachedLists.success) {
			store.dispatch(product.setConstant(cachedLists));
			this.setState({ constant: true });
		} else {
			getPromises()
			.then(response => {
				if (response[0].status === 200 && response[1].status === 200) {
					setStorageConstant(response);
					store.dispatch(product.setConstant({ category: response[0].data, manufactorer: response[1].data }));
					this.setState({ constant: true });
				} else {
					throw new Error(response[0].data.reason);
				}
			})
			.catch((err) => this.props.mainModel.setMessage('warning', err.message));
		}
	}
	modifyLast(base, id) {
		this.model.modifyLastOrder(base, id, this.props.token)
			.then((response) => {
				if (response.data.success) {
					this.props.mainModel.setMessage('success', response.data.reason);
					this.searchOrders();
				} else {
					throw new Error(response.data.reason);
				}
			})
			.catch((err) => this.props.mainModel.setMessage('warning', err.message));
	}
	redirect(path, id) {
		window.location = Config.url.path + Config.url.pathSuffix + Config.url.pathProducts + '/' + path + '/' + id;
	}
	restoreList() {
		this.searchName( getStorage() );
	}
	searchEdition() {
		store.dispatch(product.prepareResult());
		store.dispatch(product.setAction('getProductById', {basic: false, id: this.state.editionSearched}));
		this.setState({ disable: true });
	}
	searchName(data) {
		store.dispatch(product.prepareResult());
		store.dispatch(product.setAction('getByParams', { params: data, another: this.state.nameSearchData.anotherSearch }));
		setStorage(data);
		this.setState({ nameSearch: true, nameSearchData: data });
	}
	searchHistory() {
		store.dispatch(product.prepareResult());
		store.dispatch(product.setAction('getHistory', {basic: false, id: this.state.historySearched}));
	}
	setDisabled(props, state) {
		let disabled = !state.constant || (props.params.action !== undefined && props.params.id !== undefined);
		if (disabled !== state.disable) this.setState({ disable: disabled });
	}
	setError(error) {
		this.props.mainModel.setMessage('warning', error);
	}
	setHeader(data) {
		if (data.origin === 'idSearch') {
			this.setSimpleId({ id: data.productId });
		} else if (data.origin === 'avoidName') {
			data.productName = this.state.header.productName;
		}
		this.setState({ header: data });
	}
	setPrintings(data) {
		store.dispatch(product.setPrintings(data));
		this.setState({ printingSearch: false });
	}
	setSave(data) {
		window.scrollTo(0, 0);
		data.quantity = setQuantity(data.quantity);
		let attribute = this.props.product.fullDataFirst.attribute;
		this.model.saveProduct(attribute.new, attribute.old, this.state.config, data)
			.then((response) => {
				let action = response.data.success ? 'success' : 'warning';
				this.props.mainModel.setMessage(action, response.data.reason);
				this.checkModified();
			})
			.catch((err) => this.props.mainModel.setMessage(action, err.message))
			.finally(() => this.setState({ disabledEdition: false }));
	}
	setSimpleId(data) {
		setStorageSimple(data.id);
		store.dispatch(product.prepareResult());
		store.dispatch(product.setAction('getProductById', { basic: true, id: parseInt(data.id) }));
		this.setState({ editionSearched: false, historySearched: false, simpleSearched: parseInt(data.id) });
	}
	setSuccess(message) {
		this.props.mainModel.setMessage('success', message);
	}
	
	render() {
		let basic, edition, header, history, lastOrders, message, modified, nameList, printings;
		const product = this.props.product;
		const state = this.state;
		const token = this.props.token;
		if (this.props.approved) {
			header = (
				<Header
					active="products"
					buttonHandler={this.props.logoutHandler.bind(this)}
					disable={state.disable}
					linkDisable={state.modifiedSearch || state.printingSearch}
				/>
			);
			let messageStyle = this.props.success ? Config.alertSuccess : Config.alertError;
			message = <Message message={this.props.toDisplay} messageStyle={messageStyle} />;
		}
		if (!this.state.editionSearched && !this.state.historySearched && !this.state.nameSearch) {
			modified = <Modified list={product.modifiedList} delete={this.deleteMods.bind(this)} inSearch={state.modifiedSearch} />;
			lastOrders = <LastOrders data={product.lastOrders} search={product.ordersSearch} setLast={this.modifyLast.bind(this)} />;
			printings = (
				<Printings
					data={product.printings}
					handle={this.setPrintings.bind(this)}
					setError={this.setError.bind(this)}
					setSuccess={this.setSuccess.bind(this)}
					token={token}
				/>
			);
		} else if (this.state.editionSearched && !this.state.historySearched) {
			let productData = { dataFull: product.fullDataFirst, empty: product.empty, modified: product.modifiedList };
			edition = (
				<ProductEdition
					disable={state.disabledEdition}
					goBack={this.clearEdition.bind(this)}
					list={state.nameSearch}
					productData={productData}
					save={this.setSave.bind(this)}
				/>
			)
		} else if (state.historySearched && !state.editionSearched) {
			history = <ProductHistory clear={this.clear.bind(this)} id={state.editionSearched} product={product} />;
		} else if (state.nameSearch && !state.editionSearched && !state.historySearched && !state.simpleSearched) {
			nameList = (
				<ProductList
					clearList={this.clear.bind(this)}
					product={product}
					redirect={this.redirect.bind(this)}
					simpleModal={this.setSimpleId.bind(this)}
				/>
			)
		}
		if (this.state.simpleSearched) {
			basic = (
				<BasicEdition
					close={this.closeModal.bind(this)}
					dataBasic={product.basicData}
					dataReceived={product.dataReceived}
					token={token}
				/>
			)
		}
		let productHeader = (
			<ProductHeader
				data={state.header}
				product={product}
				mainState={state}
				searchName={this.searchName.bind(this)}
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
