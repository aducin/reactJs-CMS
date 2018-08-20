import React from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import store from '../store';
import * as product from '../actions/productActions.jsx';
import Config from '../Config';
import Additional from '../components/product/Additional.jsx';
import BasicEdition from '../components/modal/BasicEdition.jsx';
import Header from '../components/dumb/Header.jsx';
import Message from '../components/dumb/Message.jsx';
import ProductEdition from '../components/product/ProductEdition.jsx';
import ProductHeader from '../components/product/ProductHeader.jsx';
import ProductHistory from '../components/product/ProductHistory.jsx';
import ProductList from '../components/product/ProductList.jsx';
import productModelInstance from '../model/productModel';
import Lists from '../classes/lists';
import { clearUrl } from '../functions/clearUrl';
import { setUrl } from '../functions/setUrl';
import { setContent } from '../functions/jsx/product.jsx';
import { checkUrl } from '../functions/product/checkUrl';
import { clearStorage } from '../functions/product/clearStorage';
import { getStorage } from '../functions/product/getStorage';
import { setDisabled } from '../functions/product/setDisabled';
import { setModified, setModifiedData } from '../functions/product/setModified';
import { setStorage, setStorageSimple } from '../functions/product/setStorage';
import { stateAfterUrlCheck } from '../functions/product/stateAfterUrlCheck';
import { Header as DefaultHeader, State } from '../helper/productState';

@connect((store) => {
    return { product: store.product };
})

export default class ProductContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = State;
		this.model = productModelInstance();
		this.lists = new Lists(this.model, this.props.mainModel);
		this.model.lists.subscribe((data) => {
			store.dispatch(product.setConstant(data));
			if (!this.state.constant) {
				this.setState({ constant: true });
			}
		});
		this.model.modified.subscribe((data) => store.dispatch(product.setModified(data)));
		this.model.orders.subscribe(() => this.searchOrders());
		this.subscription = this.model.newestOrdersInterval.subscribe(() => this.checkNewestOrders());
	}

	componentDidUpdate() {
		if (this.props.token && !this.model.token) {
			this.model.setToken(this.props.token);
			if (!this.props.params.id) {
				this.clear();
			}
		}
		if (this.props.token && this.state.getList === 1) {
			this.lists.getLists();
		}
		if (this.state.action) {
			this[this.state.action]();
		}
	}
	static getDerivedStateFromProps(nextProps, previousState) {
		if (nextProps.token && !previousState.token) {
			return {token: nextProps.token};
		} else if (nextProps.token && previousState.getList === 0 && !previousState.constant) {
			return { getList: 1} ;
		} else if (previousState.getList === 1) {
			return { getList: 2 };
		} else if (nextProps.product.error) {
			nextProps.mainModel.setMessage('warning', Config.error);
			store.dispatch(product.clearError());
			return { disable: false };
		} else {
			let act = checkUrl(nextProps, previousState);
			if (act.modify) {
				if (act.dispatch) {
					store.dispatch(product[act.dispatch]());
				}
				return stateAfterUrlCheck(previousState, act);
			}
		}
		return setDisabled(nextProps, previousState);
	}

	componentWillUnmount = () => this.subscription.unsubscribe();

	shouldComponentUpdate = (nextProps, nextState) => (nextProps.approved && nextProps.token);

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
			if (button) {
				this.model.refreshModified();
			}
			this.checkNewestOrders();
		}
		let mods = setModified(this.state.modified, this.state.modifiedSearch);
		this.setState({action: null, header: DefaultHeader, modified: mods[0], modifiedSearch: mods[1], nameSearch: false});
	}

	clearEdition = () => this.setState({ action: 'clearUrl', restoreList: true });

	clearUrl = () => clearUrl(Config.url.pathProducts);

	close = () => this.setState({ simpleSearched: false });

	modsAfter = () => this.setState({ disabledEdition: false, modifiedSearch: false });

	restoreList = () => {
		this.searchName( getStorage() );
		this.setState({ action: null });
	}
	searchEdition = () => {
		store.dispatch(product.prepareResult());
		store.dispatch(product.setAction('getProductById', {basic: false, id: this.state.editionSearched}));
		this.setState({ action: null, disable: true });
	}
	searchName = (data) => {
		store.dispatch(product.prepareResult());
		store.dispatch(product.setAction('getByParams', { params: data, another: this.state.nameSearchData.anotherSearch }));
		setStorage(data);
		this.setState({ nameSearch: true, nameSearchData: data });
	}
	searchHistory = () => {
		store.dispatch(product.prepareResult());
		store.dispatch(product.setAction('getHistory', {basic: false, id: this.state.historySearched}));
		this.setState({ action: null, disable: true });
	}

	setError = (error) => this.props.mainModel.setMessage('warning', error);

	setHeader = (data) => {
		if (data.origin === 'idSearch') {
			this.setSimpleId({ id: data.productId });
		} else if (data.origin === 'avoidName') {
			data.productName = this.state.header.productName;
		}
		this.setState({ header: data });
	}
	setPrint = (data) => {
		store.dispatch(product.setPrintings(data));
		this.setState({ printingSearch: false });
	}
	setSimpleId = (data) => {
		setStorageSimple(data.id);
		store.dispatch(product.prepareResult());
		store.dispatch(product.setAction('getProductById', { basic: true, id: parseInt(data.id) }));
		this.setState({ editionSearched: false, historySearched: false, simpleSearched: parseInt(data.id) });
	}
	
	render() {
		let additional, basic, edition, header, history, message, nameList;
		const product = this.props.product;
		const state = this.state;
		const token = this.props.token;
		if (this.props.approved) {
			let links = state.modifiedSearch || state.printingSearch;
			let handler = this.props.logoutHandler;
			header = <Header active="products" buttonHandler={handler.bind(this)} disable={state.disable} linkDisable={links} />;
			let messageStyle = this.props.success ? Config.alertSuccess : Config.alertError;
			message = <Message message={this.props.toDisplay} messageStyle={messageStyle} />;
		}
		if (!this.props.params.action && !this.props.params.id && !this.state.nameSearch) {
			let search = state.modifiedSearch;
			additional = <Additional product={product} mods={this.modsAfter} print={this.setPrint} search={search} />;
		} else if (this.state.editionSearched && !this.state.historySearched) {
			let productData = { dataFull: product.fullDataFirst, empty: product.empty, modified: product.modifiedList };
			edition = (
				<ProductEdition
					disable={state.disabledEdition} goBack={this.clearEdition.bind(this)}
					list={state.nameSearch} productData={productData}
				/>
			);
		} else if (state.historySearched && !state.editionSearched) {
			history = <ProductHistory clear={this.clear.bind(this)} id={state.editionSearched} product={product} />;
		} else if (state.nameSearch && !state.editionSearched && !state.historySearched && !state.simpleSearched) {
			nameList = <ProductList clearList={this.clear.bind(this)} modal={this.setSimpleId.bind(this)} product={product} />;
		}
		if (state.simpleSearched) {
			let received = product.dataReceived;
			basic = <BasicEdition close={()=>this.close()} data={product.basicData} received={received} token={token} />;
		}
		let productHeader = (
			<ProductHeader
				data={state.header} product={product} mainState={state}
				searchName={ (data) => this.searchName(data) } setHeader={ (data) => this.setHeader(data) }
			/>
		);
		return setContent(header, message, productHeader, basic, edition, history, nameList, additional);
	}
}
