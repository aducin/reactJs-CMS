import React from 'react';

import Label from '../dumb/Label.jsx';
import Select from '../dumb/Select.jsx';
import Title from '../dumb/Title.jsx';

export default class ProductHeader extends React.Component {
	constructor(props) {
		super(props);	 
		this.state = {
			activeCategory: 0,
			activeManufactorer: 0,
			nameInQueue: false,
			productId: 0,
			productName: '',
			productLabel: this.props.message.labels.productName,
			searchDisabled: true,
			title: this.props.message.title.products,
			warning: {
				id: false,
				name: false
			}
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if (!this.props.cleared && nextProps.cleared) {
			this.setState({
				activeCategory: 0,
				activeManufactorer: 0,
				productId: 0,
				productName: ''
			});
		}
	}

	handleIdChange(value) {
		let check = isNaN(value);
		var warning = this.state.warning;
		if (check || value === 0) {
			warning['id'] = true;
			this.setState({ 
				searchDisabled: true,
				warning: warning
			});
		} else {
			let searchActive = parseInt(value) < 1;
			warning['id'] = false;
			this.setState({
				productId: value,
				productName: '',
				searchDisabled: searchActive,
				warning: warning
			});
		}
	}

	handleIdSearch() {
		let check = isNaN(this.state.productId);
		if (check || this.state.productId.length === 0) {
			this.setState({ searchDisabled: true });
		} else {
			this.setState({
				productName: ''
			}, () => {
				let data = {
					id: this.state.productId,
					edition: 'simple'
				};
				this.props.searchId(data);
			});
		}
	}

	handleNameChange(value) {
		this.setState({
			productName: value
		}, () => {
			if (value.length === 0) {
				this.setWarning('name', this.props.message.emptyField);
			} else if (value.length < 4) {
				this.setWarning('name', this.props.message.min3characters);	
			} else {
				this.setWarning('name', false);
				this.setState({
					productId: 0
				}, () => {
					if (!this.state.nameInQueue) {
						this.setState({
							nameInQueue: true
						}, () => {
							setTimeout(function() { 
								this.setState({
									nameInQueue: false
								}, () => {
									this.proceedSelect();
								});	
							}.bind(this), 1000);
						});	
					}
				});
			}
		});
	}

	handleSelectChange(e) {
    	let value = e.target.value;
    	let name = e.target.name;
    	let state = {...this.state};
    	if (name === 'category') {
    		this.setState({
				activeCategory: value
			}, () => {
    			this.proceedSelect();
			});
    	} else if (name === 'manufactorer') {
    		this.setState({
				activeManufactorer: value
			}, () => {
    			this.proceedSelect();
			});
    	}
    }

    proceedSelect() {
    	if (this.state.productName !== '' && this.state.productName.length > 3) {
    		let data = {
    			search: this.state.productName,
				category: this.state.activeCategory,
				manufactorer: this.state.activeManufactorer
			};
			this.props.searchName(data);
		}
    }

    setWarning(field, message) {
    	var warning = this.state.warning;
    	if (!message) {
    		warning[field] = false;
    		this.setState({
	    		productLabel: this.props.message.labels.productName,
				warning: warning
			});	
    	} else {
    		warning[field] = true;
	    	this.setState({
	    		productLabel: message,
				warning: warning
			}, () => {
				setTimeout(function() { 
					warning[field] = false;
					this.setState({
	    				productLabel: this.props.message.labels.productName,
						warning: warning
					});	
				}.bind(this), 3000);
			});	
		}
    }

	render() {
		let productId = this.state.productId !== 0 ? this.state.productId : '';
		let productName = this.state.productName;
		let message = this.props.message;
		/*
		if (!this.props.constant && !this.props.error) {
      		return (
		  		<Title title={this.props.message.loading} />
	        );
      	} else if (this.props.constant) {
      	*/
      	if (!this.props.error) {
      		const noData = {
      			id: 0,
      			nameCategory: message.nameCategory,
      			nameManufactorer: message.nameManufactorer,
      		};
      		const chooseFrom = 'Wybierz sposród ';
      		const categoryLength = this.props.category.length;
      		const titleCategory = chooseFrom + categoryLength + ' kategorii:';
      		var listCategories = this.props.category.map((el, index) => {
      			return <option key={index + 1} value={this.props.category[index].id}>{this.props.category[index].metaTitle}</option>;
      		});
      		if (this.state.activeCategory === 0) {
      			var check = this.props.category.findIndex(function(el) { el.id == noData.id; });
      			if (check === -1) {
      				listCategories.unshift(<option key="0" value={ noData.id }>{ noData.nameCategory }</option>);
      			}
      		}
      		const manufactorerLength = this.props.manufactorer.length;
      		const titleManufactorer = chooseFrom + manufactorerLength + ' producentów:';
      		var listManufactorers = this.props.manufactorer.map((el, index) => {
      			return <option key={index + 1} value={this.props.manufactorer[index].id}>{this.props.manufactorer[index].name}</option>;
      		});
      		if (this.state.activeManufactorer === 0) {
      			var check = this.props.manufactorer.findIndex(function(el) { el.id == noData.id; });
      			if (check === -1) {
      				listManufactorers.unshift(<option key="0" value={ noData.id }>{ noData.nameManufactorer }</option>);
      			}
      		}
      		let inputStyleId = this.state.warning['id'] ? {borderColor: "#a94442"} : null;
      		let inputStyleName = this.state.warning['name'] ? {borderColor: "#a94442"} : null;
      		let labelClass = this.state.warning['name'] ? "colorWarning" : null;
      		return (
				<div class="container bgrContent borderRadius10 marginTop40px paddingBottom40px">
					<div class="col-xs-12">
						<Title title={this.state.title} />
					</div>
					<div class="col-xs-12">
						<div class="col-xs-12 col-lg-7 pull-left">
							<div class="col-xs-12 paddingBottom10px">
								<h4>{message.products.nameSearch}</h4>
							</div>
							<div>
								<Select
									curClass="col-xs-12 marginBottom10px"
									setDisabled={this.props.disable}
									list={ listCategories }
									name="category"
									selectChange={ this.handleSelectChange.bind(this) }
									title={ titleCategory }
									value={ this.state.activeCategory }
								/>
								</div>
								<div class="marginBottom20px">
									<Select
										curClass="col-xs-12 marginBottom10px"
										setDisabled={this.props.disable}
										list={ listManufactorers }
										name="manufactorer"
										selectChange={ this.handleSelectChange.bind(this) }
										title={titleManufactorer}
										value={ this.state.activeManufactorer }
									/>
								</div>
							<Label curClass={labelClass} name={this.state.productLabel} />
							<div class="col-xs-12 col-lg-6">
								<input class="form-control" disabled={this.props.disable} type="text" value={productName} placeholder="Podaj nazwę" onChange={ e => this.handleNameChange(e.target.value) } style={ inputStyleName } />
							</div>
						</div>
						<div class="col-xs-12 col-lg-2 pull-left"></div>
						<div class="col-xs-12 col-lg-3 pull-left">
							<div class="paddingBottom10px">
								<h4>{message.products.idSearch}</h4>
							</div>
							<div class="marginBottom10px">
										<input class="centered form-control" disabled={this.props.disable} type="text" value={productId} placeholder="Podaj ID" onChange={ e => this.handleIdChange(e.target.value) } style={ inputStyleId } />
								</div>
								<div>
									<input class="form-control btn btn-primary" disabled={this.state.searchDisabled} type="button" value="Wyszukaj" onClick={ this.handleIdSearch.bind(this) } />
								</div>
						</div>
					</div>
				</div>
	    	);
      	} else if (this.props.error) {
	        return (
		  		<Title title={this.props.message.error} />
	    	);
	    }
	}
}