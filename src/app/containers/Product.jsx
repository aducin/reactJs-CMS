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
import productModelInstance from '../model/productModel';
import Lists from '../classes/lists';
import { clearUrl } from '../functions/clearUrl';
import { setUrl } from '../functions/setUrl';
import { setContent } from '../functions/jsx/container.jsx';
import { checkUrl } from '../functions/product/checkUrl';
import { clearStorage } from '../functions/product/clearStorage';
import { getStorage } from '../functions/product/getStorage';
import { setModified, setModifiedData } from '../functions/product/setModified';
import { setStorage, setStorageSimple } from '../functions/product/setStorage';
import { stateAfterUrlCheck } from '../functions/stateAfterUrlCheck';
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

	componentDidMount() {
		this.checkComponent();
	}
	componentDidUpdate() {
		if (this.state.action) {
			this[this.state.action]();
		}
	}
	componentWillUnmount() { this.subscription.unsubscribe() }
	componentWillUpdate(nextProps, nextState) {
		this.setDisabled(nextProps, nextState);
		if (!this.props.token && nextProps.token) {
			this.model.setToken(nextProps.token);
		}
		if (!this.state.componentSearched && nextState.componentSearched && !nextProps.params.id) {
			this.clear();
		} else if (nextProps.product.error) {
			this.props.mainModel.setMessage('warning', Config.error);
			store.dispatch(product.clearError());
			this.setState({ disable: false });
		} else {
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
		this.lists.getLists();
		this.setState({ componentSearched: true });
	}
	checkUrl(nextProps, nextState) {
		let act = checkUrl(nextProps, nextState);
		if (act.modify) {
			if (act.dispatch) {
				store.dispatch(product[act.dispatch]());
			}
			this.setState( stateAfterUrlCheck(this.state, act) );
		}
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
			if (button) {
				this.model.refreshModified();
			}
			this.checkNewestOrders();
		}
		let mods = setModified(this.state.modified);
		this.setState({ header: DefaultHeader, modified: mods[0], modifiedSearch: mods[1], nameSearch: false});
	}

	clearEdition = () => this.setState({ action: 'clearUrl', restoreList: true });

	clearUrl = () => clearUrl(Config.url.pathProducts);

	close = () => this.setState({ simpleSearched: false });

	modsAfter = () => this.setState({ disabledEdition: false, modifiedSearch: false });

	restoreList = () => this.searchName( getStorage() );

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

	setError = (error) => this.props.mainModel.setMessage('warning', error);

	setHeader(data) {
		if (data.origin === 'idSearch') {
			this.setSimpleId({ id: data.productId });
		} else if (data.origin === 'avoidName') {
			data.productName = this.state.header.productName;
		}
		this.setState({ header: data });
	}
	setPrint(data) {
		store.dispatch(product.setPrintings(data));
		this.setState({ printingSearch: false });
	}
	setSimpleId(data) {
		setStorageSimple(data.id);
		store.dispatch(product.prepareResult());
		store.dispatch(product.setAction('getProductById', { basic: true, id: parseInt(data.id) }));
		this.setState({ editionSearched: false, historySearched: false, simpleSearched: parseInt(data.id) });
	}
	
	render() {
		let basic, edition, header, history, lastOrders, message, modified, nameList, print;
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
		if (token && !this.props.params.action && !this.props.params.id && !this.state.nameSearch) {
			let list = product.modifiedList;
			modified = <Modified after={() => this.modsAfter() } list={list} search={state.modifiedSearch} />;
			lastOrders = <LastOrders data={product.lastOrders} search={product.ordersSearch} />;
			print = <Printings data={product.printings} handle={this.setPrint.bind(this)} />;
		} else if (this.state.editionSearched && !this.state.historySearched) {
			let productData = { dataFull: product.fullDataFirst, empty: product.empty, modified: product.modifiedList };
			edition = (
				<ProductEdition
					disable={state.disabledEdition} goBack={this.clearEdition.bind(this)}
					list={state.nameSearch} productData={productData}
				/>
			)
		} else if (state.historySearched && !state.editionSearched) {
			history = <ProductHistory clear={this.clear.bind(this)} id={state.editionSearched} product={product} />;
		} else if (state.nameSearch && !state.editionSearched && !state.historySearched && !state.simpleSearched) {
			nameList = <ProductList clearList={this.clear.bind(this)} modal={this.setSimpleId.bind(this)} product={product} />;
		}
		if (this.state.simpleSearched) {
			let received = product.dataReceived;
			basic = <BasicEdition close={()=>this.close()} data={product.basicData} received={received} token={token} />;
		}
		let productHeader = (
			<ProductHeader
				data={state.header} product={product} mainState={state}
				searchName={this.searchName.bind(this)} setHeader={this.setHeader.bind(this)}
			/>
		);
		return setContent(header, message, productHeader, basic, edition, history, nameList, modified, lastOrders, print);
	}
}
