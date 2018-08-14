import React from 'react';

import Config from '../../Config';
import Label from '../dumb/Label.jsx';
import Select from '../dumb/Select.jsx';
import Title from '../dumb/Title.jsx';

import { handleIdChange as IdChange } from '../../functions/product/handleIdChange';
import { handleIdSearch as IdSearch } from '../../functions/product/handleIdSearch';
import { handleSelectChange as SelectChange } from '../../functions/product/handleSelectChange';
import { setListCategories, setListManufactorers } from '../../functions/jsx/header.jsx';

let nameInQueue = false;
let nameValue;

const ProductHeader = ( props ) => {
	const handleIdChange = (value) => props.setHeader(IdChange(value, props.data));
	const handleIdSearch = () => props.setHeader(IdSearch(props.data));
	const handleNameChange = (value) => {
		nameValue = value;
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
				finalData.warning = { id: false, name: false };
				props.setHeader(finalData);
			}.bind(this), Config.queueTime);
		}
	};
	const handleSelectChange = (e) => {
		let data = SelectChange(e, props.data);
		props.setHeader(data);
		proceedSelect(data);
	};
	const proceedSelect = (data = null) => {
		if (!data) {
			data = {...props.data, productName: nameValue};
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
	if (props.mainState.error) {
		return <Title title={message.error} />;
	} else {
		const noData = { id: 0, nameCategory: message.nameCategory, nameManufactorer: message.nameManufactorer };
		const categories = props.product ? props.product.categoryList : [];
		const disabled = props.mainState.disable;
		const titleCategory = message.chooseFrom + categories.length + ' kategorii:';
		const listCategories = setListCategories(categories, data.activeCategory, noData);
		const manufactorer = props.product.manufacturerList;
		const titleManufactorer = message.chooseFrom + manufactorer.length + ' producentów:';
		const listManufactorers = setListManufactorers(manufactorer, data.activeManufactorer, noData);
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
								setDisabled={disabled}
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
								setDisabled={disabled}
								list={ listManufactorers }
								name="manufactorer"
								selectChange={ handleSelectChange.bind(this) }
								title={titleManufactorer}
								value={ data.activeManufactorer }
							/>
						</div>
						<Label curClass={labelClass} name={data.productLabel} />
						<div class="col-xs-12 col-lg-6">
							<input class="form-control" disabled={disabled} type="text" value={productName} placeholder="Podaj nazwę" onChange={ e => handleNameChange(e.target.value) } style={ inputStyleName } />
						</div>
					</div>
					<div class="col-xs-12 col-lg-2 pull-left"></div>
					<div class="col-xs-12 col-lg-3 pull-left">
						<div class="paddingBottom10px">
							<h4>{message.products.idSearch}</h4>
						</div>
						<div class="marginBottom10px">
							<input class="centered form-control" disabled={disabled} type="text" value={productId} placeholder="Podaj ID" onChange={ e => handleIdChange(e.target.value) } style={ inputStyleId } />
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
