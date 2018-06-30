import React from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { reactLocalStorage } from 'reactjs-localstorage';
import axios from 'axios';

import store from '../store.jsx';
import * as product from '../actions/productActions.jsx';

import Config from '../Config.jsx';
import Helper from '../components/Helper.jsx';
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
		this.state = {
			askForData: false,
			category: 0,
			categoryDisplay: false,
			cleared: false,
			constant: false,
			currentId: {
				full: null,
				simple: null
			},
			disable: true,
			disabledEdition: false,
			editionSearched: false,
			error: false,
			file: null,
			historySearched: false,
			imageDisplay: false,
			manufactorer: 0,
			modified: false,
			modifiedSearch: false,
			nameSearch: false,
			printingSearch: false,
			restoreList: false,
			searching: false,
			simpleSearched: false,
			success: false,
			toDisplay: undefined,
			warning: false,
		}
	}

	componentDidMount() {
		if (this.props.approved && !this.state.askForData) {
			this.checkComponent(this.props, this.state);
		} else if (this.props.approved) {
			this.checkUrl(this.props, this.state);
		}
	}

	componentWillUpdate(nextProps, nextState) {
		this.setDisabled(nextProps, nextState);
		if (nextProps.approved && !nextState.askForData) {
			this.checkComponent(nextProps, nextState);
		} else if (nextProps.approved) {
			this.checkUrl(nextProps, nextState);
		}
	}

	componentWillUnmount() {
		this.props.unsubscribe();
	}

	checkComponent(props, state) {
		this.setState({
			askForData: true,
		}, () => {
			this.clearData();
			this.getConstant();
			this.checkUrl(props, state);
		});
	}
	
	checkUrl(nextProps, nextState) {
		if (nextProps.params.action !== undefined && nextProps.params.id !== undefined) {
			let action = nextProps.params.action;
			let id = nextProps.params.id;
			if (action === 'edition' && nextState.editionSearched !== id) {
				this.setState({
					editionSearched: id,
					historySearched: false,
					simpleSearched: false
				}, () => {
					store.dispatch(product.clearData());
					this.searchId();
				});
			} else if (action === 'history' && nextState.historySearched !== id) {
				this.setState({
					editionSearched: false,
					historySearched: id,
					simpleSearched: false
				}, () => {
					store.dispatch(product.clearData());
					this.searchHistory();
				});
			}
		} else {
			if (nextState.restoreList) {
				this.setState({
					editionSearched: false,
					restoreList: false
				}, () => {
					let data = {
						category: reactLocalStorage.get('categorySearch'),
						manufactorer: reactLocalStorage.get('manufactorerSearch'),
						search: reactLocalStorage.get('nameSearch')
					};
					this.nameSearch(data);
				});
			} else if (nextState.editionSearched || nextState.historySearched) {
				this.setState({
					editionSearched: false,
					historySearched: false,
				}, () => {
					this.clearData();
				});
			}
		}
	}

	checkModified() {
		this.setState({
			modified: true,
			modifiedSearch: true
		}, () => {
			let url = Helper.setUrl('pathProducts', 'modified');
			axios.get(url)
	    	.then((response) => {
	    		this.setState({
    				modifiedSearch: false
    			}, () => {
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
						this.props.searchOrders();
						this.checkPrintings();
		    	});
	    	})
	    	.catch((err) =>{
					console.log(err);
					this.props.setWarning(err.message);
		    });	
		});
	}

	checkPrintings() {
		this.setState({
			printingSearch: true
		}, () => {
			let url = Helper.setUrl('pathProducts', 'printing', this.props.token);
			axios.get(url)
				.then((response) => {
					if (response.status === 200 && response.data.success) {
						let ajaxResponse = response.data;
						let data = {
							deliveryList: ajaxResponse.deliveryList,
							list: ajaxResponse.list || null,
							empty: ajaxResponse.empty,
							emptyDelivery: ajaxResponse.emptyDelivery || null
						};
						this.setState({
							printingSearch: false
						}, () => {
							store.dispatch(product.setPrintings(data));
						});
					}
				})
				.catch((err) =>{
					this.displayError(err);
				});
		});
	}

	clearData(button) {
		this.setState({
			cleared: true,
			modifiedSearch: false,
			nameSearch: false
		}, () => {
			reactLocalStorage.set('categorySearch', null);
			reactLocalStorage.set('manufactorerSearch', null);
			reactLocalStorage.set('nameSearch', null);
			store.dispatch(product.clearData());
			if(!this.state.modified) {
				this.checkModified();
			}
			if (button) {
				store.dispatch(product.clearInputs(bool));
			}
			this.setState({
				cleared: false
			});	
		});
	}

	clearEdition() {
		this.setState({
			restoreList: true
		}, () => {
			let url = Config.url.path + Config.url.pathSuffix + Config.url.pathProducts;
			window.location = url;
		});
	}

	closeModal() {
		this.setState({
			simpleSearched: false
		});
	}

	deleteModified(id) {
		let token = this.props.token;
		let url = Config.url.serverPath + 'products/modified/' + id;
		axios.delete(url, {
			params: { token: token }
		})
		.then((response) => {
			if (response.status === 200 && response.data.success) {
				this.props.setSuccess(response.data.reason);
				this.checkModified();
			} else {
				this.props.setWarning(response.data.reason);
			}
		}).catch((err) =>{
			store.dispatch(product.setError(err));
		});
	}

	getConstant() {
		var cached = reactLocalStorage.getObject('constant');
		var manufactorerCache = reactLocalStorage.getObject('manufactorer');
		if (cached !== undefined && cached.category !== undefined && cached.manufactorer !== undefined) {
			let data = {
				category: cached.category,
				manufactorer: cached.manufactorer,
			};
			this.setState({
				constant: true,
			}, () => {
				store.dispatch(product.setConstant(data));
			});
		} else {
			let categoryUrl = Config.url.serverPath + 'categories';
			let manufactorerUrl = Config.url.serverPath + 'manufacturers';
			var category = axios.get(categoryUrl);
			var manufactorer = axios.get(manufactorerUrl);
			reactLocalStorage.setObject('constant', {'category': category, 'manufactorer': manufactorer});
			Promise.all([category, manufactorer])
			.then(response => { 
				if (response[0].status === 200 && response[1].status === 200) {
					this.setState({
						constant: true,
					}, () => {
						let data = {
							category: response[0].data,
							manufactorer: response[1].data,
						};
						reactLocalStorage.setObject('constant', {'category': response[0].data, 'manufactorer': response[1].data});
						store.dispatch(product.setConstant(data));
					});
				} else {
					var reason;
					if (!response[0].data.success) {
						reason = response[0].data.reason;
					} else {
						reason = response[0].data.reason;
					}
					this.props.setError(reason);
				}
			})   
			.catch((err) =>{
			    store.dispatch(product.setError(err));
			});
		}
	}

	modifyLastOrder(base, id) {
		let url = Config.url.serverPath + 'orders/last/' + base + '/' + id + '/' + this.props.token;
		axios.get( url )
			.then((response) => {
				if (response.data.success) {
					this.props.setSuccess(response.data.reason);
					this.props.searchOrders();
					//this.checkOrders();
				} else {
					this.props.setWarning(response.data.reason);
				}
			})
			.catch((err) =>{
				store.dispatch(product.setError(err));
			});
	}

	nameSearch(data) {
		this.setState({
			nameSearch: true
		}, () => {
			let url = Config.url.serverPath + 'products';
			axios.get( url, {params: data} )
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
	    		}
	    	})
	    	.catch((err) =>{
	    		store.dispatch(product.setError(err));
	    	});
		});
	}

	redirect(path, id) {
		let url = Config.url.path + Config.url.pathSuffix + Config.url.pathProducts + '/' + path + '/' + id;
		window.location = url;
	}
	
	saveProduct(data) {
		let newAttr = this.props.product.fullDataFirst.attribute.new;
		let oldAttr = this.props.product.fullDataFirst.attribute.old;
		let url = Config.url.serverPath + 'products' + '/' + data.id + '/' + newAttr + '/' + oldAttr;
		if (data.quantity.modified !== undefined) {
			var curQuantity = data.quantity.modified;
		} else if (data.quantity.old !== undefined) {
			var curQuantity = data.quantity.old;
		} else {
			var curQuantity = data.quantity;
		}
		data.quantity = curQuantity;
		this.setState({
			disabledEdition: true,
		}, () => {
			window.scrollTo(0, 0);
			axios.put(url, {data}, this.state.config)
    		.then((response) => {
    			this.setState({
    				disabledEdition: false
    			}, () => {
    				let action = response.data.success ? 'setSuccess' : 'setWarning';
    				this.props[action](response.data.reason);
						this.checkModified();
    			});
    		})
    		.catch((err) =>{
    			this.setState({
    				disabledEdition: false
    			}, () => {
					this.props.setWarning(Config.message.error);
				});
			});
		});
	}

	searchId() {
		store.dispatch(product.prepareResult());
		let url = Config.url.serverPath + Config.url.pathProducts + '/';
		let curNumber;
		if (this.state.editionSearched) {
			url += this.state.editionSearched;
			curNumber = this.state.editionSearched;
		} else if (this.state.simpleSearched) {
			url += this.state.simpleSearched + '?basic=true';
			curNumber = this.state.simpleSearched;
		}
		reactLocalStorage.set('searchId', curNumber);
		this.setState({
			searching: true,
		}, () => {
			axios.get(url, {})
	    	.then((response) => {
	    		if (response.status === 200) {
	    			this.setState({
		    			disable: false,
		    			searching: false,
		    		}, () => {
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
		    		});
	    		} else {
	    			this.props.setWarning(response.data.reason);
	    		}
	    	})
	    	.catch((err) =>{
	    		this.props.setWarning(Config.message.error);
	    	});
		});
	}

	searchHistory() {
		store.dispatch(product.prepareResult());
		let url = Config.url.serverPath + Config.url.pathProducts + '/' + this.state.historySearched + '/history';
		axios.get(url)
    	.then((response) => {
    		if (response.status === 200 && response.data) {
    			store.dispatch(product.setHistory(response.data, this.state.historySearched));
    		} else {
    			store.dispatch(product.setError(response.reason));
    		}
    	})
    	.catch((err) =>{
    		store.dispatch(product.setError(err));
    	});
	}

	setDisabled(props, state) {
		let disabled = !state.constant || (props.params.action !== undefined && props.params.id !== undefined);
		if (disabled !== this.state.disable) {
			this.setState({
				disable: disabled
			});
		}
	}

	setError(error) {
		this.props.setError(error);
	}

	setSimpleId(data) {
		this.setState({
			editionSearched: false,
			historySearched: false,
			simpleSearched: parseInt(data.id)
		}, () => {
			this.searchId();
		});
	}

	setSuccess(message) {
		this.props.setSuccess(message);
	}
	
    render() {
    	let header, message, messageStyle, lastOrders, printings;
	  	if (this.props.success) {
		  	messageStyle = "alert alert-success alertHeight textAlignCenter";
	  	} else if (this.props.error) {
	  		messageStyle = "alert alert-danger alertHeight textAlignCenter";
	  	}
    	if (this.props.approved) {
    		header = (
    			<div class="height12">
	    			<Header 
	    				active="products" 
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
    	}
    	let basic, edition, history, modified, nameList;
    	let includeModal = false;
    	if (!this.state.editionSearched && !this.state.historySearched && !this.state.nameSearch) {
    		modified = (
    			<Modified 
						list={this.props.product.modifiedList}
						delete={this.deleteModified.bind(this)}
						disable={this.state.disable}
						inSearch={this.state.modifiedSearch}
						message={Config.message}
						url={Config.url}
					/>
    		);
				lastOrders = (
					<LastOrders
						data={this.props.product.lastOrders}
						inSearch={this.props.product.ordersSearch}
						message={Config.message}
						setLastOrder={this.modifyLastOrder.bind(this)}
						url={Config.url}
					/>
				);
				printings = (
					<Printings
						data={this.props.product.printings}
						getPrintings={this.checkPrintings.bind(this)}
						inSearch={this.state.printingSearch}
						message={Config.message}
						setError={this.setError.bind(this)}
						setSuccess={this.setSuccess.bind(this)}
						token={this.props.token}
						url={Config.url}
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
    				save={this.saveProduct.bind(this)}
    				url={Config.url}
    			/>
    		)
    	} else if (!this.state.editionSearched && this.state.historySearched) {
    		history = (
    			<ProductHistory
    				clear={this.clearData.bind(this)}
    				id={this.state.editionSearched}
    				message={Config.message}
    				product={this.props.product}
    				url={Config.url}
    			/>
    		)
    	} else if (this.state.nameSearch && !this.state.editionSearched && !this.state.historySearched) {
    		nameList = (
    			<ProductList 
    				clearList={this.clearData.bind(this)}
    				product={this.props.product}
    				message={Config.message}
    				redirect={this.redirect.bind(this)}
    				simpleModal={this.setSimpleId.bind(this)}
    				url={Config.url}
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
    	let productHeader = (
    		<ProductHeader 
		      	category={this.props.category}
		      	cleared={this.state.cleared}
		      	constant={this.state.constant}
		      	disable={this.state.disable}
		      	error={this.state.error}
		      	manufactorer={this.props.manufactorer}
		      	message={Config.message}
		      	searched={searchedCheck}
		      	searchId={this.setSimpleId.bind(this)}
		      	searchName={this.nameSearch.bind(this)}
		    />
    	);
    	let searchedCheck = this.state.editionSearched || this.state.historySearched;
    	let margin = 'marginTop1';
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
