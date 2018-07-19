import React from 'react';

import Config from '../../Config';
import Label from '../dumb/Label.jsx';
import Select from '../dumb/Select.jsx';
import Title from '../dumb/Title.jsx';

let nameInQueue = false;

const ProductHeader = ( props ) => {
	const handleIdChange = (value) => {
		let data = {...props.data, origin: 'id'};
		let check = isNaN(value);
		let warning = {...props.data.warning};
		if (check || value === 0) {
			warning['id'] = true;
			data.warning = warning;
			data.searchDisabled = true;
		} else {
			let activeSearch = parseInt(value) < 1;
			warning['id'] = false;
			data.productId = value;
			data.productName = '';
			data.searchDisabled = activeSearch;
			data.warning = warning;
		}
		props.setHeader(data);
	};
	const handleIdSearch = () => {
		let value = props.data.productId;
		let check = isNaN(value);
		let data = {...props.data, origin: 'idSearch'};
		if (check || value === 0) {
			data.searchDisabled = true;
		} else {
			data.productName = '';
		}
		props.setHeader(data);
	};
	const handleNameChange = (value) => {
		let data = {...props.data, origin: 'name'};
		let proceed = false;
		let timeout = false;
		data.productName = value;
		if (value.length === 0 || value.length < 4) {
			data.warning.name = true;
			data.productLabel = value.length === 0 ? Config.message.emptyField : Config.message.min3characters;
			timeout = true;
		} else {
			data.productId = 0;
			if (!nameInQueue) {
				nameInQueue = true;
				proceed = true;
			}
		}
		props.setHeader(data);
		if (proceed) {
			setTimeout(function () {
				nameInQueue = false;
				proceedSelect();
			}.bind(this), Config.queueTime);
		} else if (timeout) {
			setTimeout(function () {
				let finalData = {...data, origin: 'avoidName'};
				finalData.warning = {
					id: false,
					name: false
				};
				props.setHeader(finalData);
			}.bind(this), Config.queueTime);
		}
	};
	const handleSelectChange = (e) => {
		let value = e.target.value;
		let name = e.target.name;
		let data = {...props.data, origin: 'select'};
		if (name === 'category') {
			data.activeCategory = value;
		} else if (name === 'manufactorer') {
			data.activeManufactorer = value;
		}
		props.setHeader(data);
		proceedSelect(data);
	};
	const proceedSelect = (data = null) => {
		if (!data) {
			data = props.data;
		}
		if (data.productName !== '' && data.productName.length > 3) {
			let searchData = {
				search: data.productName,
				category: data.activeCategory,
				manufactorer: data.activeManufactorer
			};
			props.searchName(searchData);
		}
	};
	let data = props.data;
	let productId = data.productId !== 0 ? data.productId : '';
	let productName = data.productName;
	let message = Config.message;
	let warning = props.data.warning;
	if (props.error) {
		return (
			<Title title={props.message.error} />
		);
	} else {
		const noData = {
			id: 0,
			nameCategory: message.nameCategory,
			nameManufactorer: message.nameManufactorer,
		};
		const chooseFrom = 'Wybierz sposród ';
		const categoryLength = props.category.length;
		const titleCategory = chooseFrom + categoryLength + ' kategorii:';
		var listCategories = props.category.map((el, index) => {
			return <option key={index + 1} value={props.category[index].id}>{props.category[index].metaTitle}</option>;
		});
		if (data.activeCategory === 0) {
			var check = props.category.findIndex(function(el) { el.id == noData.id; });
			if (check === -1) {
				listCategories.unshift(<option key="0" value={ noData.id }>{ noData.nameCategory }</option>);
			}
		}
		const manufactorerLength = props.manufactorer.length;
		const titleManufactorer = chooseFrom + manufactorerLength + ' producentów:';
		var listManufactorers = props.manufactorer.map((el, index) => {
			return <option key={index + 1} value={props.manufactorer[index].id}>{props.manufactorer[index].name}</option>;
		});
		if (data.activeManufactorer === 0) {
			var check = props.manufactorer.findIndex(function(el) { el.id == noData.id; });
			if (check === -1) {
				listManufactorers.unshift(<option key="0" value={ noData.id }>{ noData.nameManufactorer }</option>);
			}
		}
		let inputStyleId = warning['id'] ? {borderColor: "#a94442"} : null;
		let inputStyleName = warning['name'] ? {borderColor: "#a94442"} : null;
		let labelClass = warning['name'] ? "colorWarning" : null;
		return (
			<div class="container bgrContent borderRadius10 marginTop40px paddingBottom40px">
				<div class="col-xs-12">
					<Title title={data.title} />
				</div>
				<div class="col-xs-12">
					<div class="col-xs-12 col-lg-7 pull-left">
						<div class="col-xs-12 paddingBottom10px">
							<h4>{message.products.nameSearch}</h4>
						</div>
						<div>
							<Select
								curClass="col-xs-12 marginBottom10px"
								setDisabled={props.disable}
								list={ listCategories }
								name="category"
								selectChange={ handleSelectChange.bind(this) }
								title={ titleCategory }
								value={ data.activeCategory }
							/>
						</div>
						<div class="marginBottom20px">
							<Select
								curClass="col-xs-12 marginBottom10px"
								setDisabled={props.disable}
								list={ listManufactorers }
								name="manufactorer"
								selectChange={ handleSelectChange.bind(this) }
								title={titleManufactorer}
								value={ data.activeManufactorer }
							/>
						</div>
						<Label curClass={labelClass} name={data.productLabel} />
						<div class="col-xs-12 col-lg-6">
							<input class="form-control" disabled={props.disable} type="text" value={productName} placeholder="Podaj nazwę" onChange={ e => handleNameChange(e.target.value) } style={ inputStyleName } />
						</div>
					</div>
					<div class="col-xs-12 col-lg-2 pull-left"></div>
					<div class="col-xs-12 col-lg-3 pull-left">
						<div class="paddingBottom10px">
							<h4>{message.products.idSearch}</h4>
						</div>
						<div class="marginBottom10px">
							<input class="centered form-control" disabled={props.disable} type="text" value={productId} placeholder="Podaj ID" onChange={ e => handleIdChange(e.target.value) } style={ inputStyleId } />
						</div>
						<div>
							<input class="form-control btn btn-primary" disabled={data.searchDisabled} type="button" value="Wyszukaj" onClick={ handleIdSearch.bind(this) } />
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default ProductHeader;
