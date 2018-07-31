import React from 'react';
import ReactDOM from 'react-dom';
import ReactTooltip from 'react-tooltip';

import Config from '../../Config';
import Helper from '../../helper/Helper.jsx';

import Busy from '../dumb/Busy.jsx';
import ButtonSingle from '../dumb/ButtonSingle.jsx';
import Checkbox from '../dumb/Checkbox.jsx';
import Input from '../dumb/Input.jsx';
import Label from '../dumb/Label.jsx';
import Select from '../dumb/Select.jsx';
import Title from '../dumb/Title.jsx';
import Warning from '../dumb/Warning.jsx';

const cssPadding12 = {
	paddingBottom: 12, 
	paddingTop: 12
};

const imgCss = {
	height: '100px',
	width: '100px',
	color: 'blue',
	border: '1px solid #ddd',
	borderRadius: 3,
};

export default class ProductEdition extends React.Component {
	constructor(props) {
		super(props);	    
		this.state = {
			id: false,
			activatedFull: false,
			activatedSimple: false,
			categoryDisplay: false,
			deletePhoto: false,
			emptyObj: {id: null, name: 'Nie wybrano'},
			fields: ['active', 'condition', 'deletePhoto', 'description', 'descriptionShort', 'id', 'linkRewrite', 'manufactorer', 'metaDescription',
			'metaTitle', 'name', 'price', 'productCategories', 'productTags', 'productUpdated', 'quantity'],
			imageDisplay: false,
		    productUpdated: false,
		}
	}

	/*
   componentDidMount() {
    this.equalState(this.props, this.state);
   }
   */

	componentWillUpdate(nextProps, nextState) {
		this.equalState(nextProps, nextState);
	}

	descriptionChange(e) {
		this.setState({
			description: e.target.value
		});
	}

	equalState(props, state) {
		let product = props.dataFull;
		if (state.id !== product.id) {
			let curState = {...this.state};
			this.state.fields.forEach((el) => {
				if (el !== 'deletePhoto' && el !== 'productUpdated') {
					curState[el] = product[el];
				} else {
					curState[el] = false;
				}
			});
			this.setState(curState);
		}
	}

	handleCheckboxChange(list, origin) {
		if (origin !== 'checkboxOptions') {
			this.setState({
				productCategories: list
			});
		} else {
			let deletePhoto = list.indexOf(1) !== -1;
			let updated = list.indexOf(2) !== -1;
			this.setState({
				deletePhoto: deletePhoto,
				productUpdated: updated,
			});	
		}
	}

	handleSelectChange(e) {
		let value = e.target.value;
		let name = e.target.name;
		let active = name === 'active' ? value : this.state.active;
		let condition = name === 'condition' ? value : this.state.condition;
		let manufactorer = name === 'manufactorer' ? value : this.state.manufactorer;
		this.setState({
			active: active,
			condition: condition,
			manufactorer: manufactorer
		});	
	}

	hideOrShow(field) {
		let categoryDisplay = field === 'category' ? !this.state.categoryDisplay : this.state.categoryDisplay;
		let imageDisplay = field === 'image' ? !this.state.imageDisplay : this.state.imageDisplay;
		this.setState({
			categoryDisplay: categoryDisplay,
			imageDisplay: imageDisplay
		});
	}

	inputModify(data) {
		var origin = data.target.name;
		var value = data.target.value;
		if (origin !== 'priceNew' && origin !== 'priceOld' && origin !== 'quantity') {
			let curState = {...this.state};
			curState[origin] = value;
			this.setState( curState );
		} else if (origin === 'quantity') {
			this.state.quantity.modified = parseInt(value);
		} else {
			let curPrice = {...this.state.price};
			if (origin === 'priceNew') {
				curPrice.new = value;
			} else if (origin === 'priceOld') {
				curPrice.old = value;
			}
			this.setState({
				price: curPrice
			});
		}
	}

	saveFull() {
		let curState = {...this.state};
		let data = this.state.fields.reduce((obj, key) => {
			obj[key] = curState[key];
			return obj;
		}, {});
		if (typeof(data.productTags) === 'object') {
			let tags = data.productTags.map((el) => {
				return el.name;
			});
			data.productTags = tags.join(', ');
		}
		data.action = 'full';
		this.props.save(data);
	}

	render() {
		function handleSelect(el, id, object) {
			var curBool = el.id === id;
			object.push(<option key={ el.id } value={ el.id }>{ el.name }</option>);
			return object;
		};
		const centered = Config.css.centered;
		const message = Config.message;
		const labels = message.labels;
		const url = Config.url;
		let disabled = Boolean(this.props.disable);
		if (this.props.dataFull && this.props.dataFull.id !== undefined && this.props.dataFull.id !== 0) {
			let product = this.props.dataFull;
			const curId = product.id;
		    let idCheck = parseInt(this.props.id) === parseInt(curId);
		    let buttons, clear, content, goBack, saveButton;
		    let title = message.fullEdition + curId;
		    let leftColumn;
		    let rightColumnClass;
		    var priceNew = product.price !== undefined ? parseFloat(product.price.new) : null;
			var priceOld = product.price !== undefined ? parseFloat(product.price.old) : null;
			let curUrl = 'products/history/' + curId;
			var discountNew = false;
			var discountOld = false;
			var realDiscountNew = false;
			var realDiscountOld = false;
			if (product.priceReal !== undefined) {
			   	if (product.priceReal.new && product.priceReal.new !== product.price.new) {
			    	discountNew = true;
			    	var currentDiscount = product.discount.new;
			    	let discountType = currentDiscount.reductionType;
			    	if (discountType === "percentage") {
			    		let currentAmount = currentDiscount.reduction * 100;
			    		realDiscountNew = currentAmount + '%';
			    	} else if (discountType === "amount") {
			    		realDiscountNew = currentDiscount.reduction + message.currency;
			    	}
			    }
			    if (product.priceReal.old && product.priceReal.old !== product.price.old) {
			    	discountOld = true;
			    	var currentDiscount = product.discount.old;
			    	let discountType = currentDiscount.reductionType;
			    	if (discountType === "percentage") {
			    		let currentAmount = currentDiscount.reduction * 100;
			    		realDiscountOld = currentAmount + '%';
			    	} else if (discountType === "amount") {
			    		realDiscountOld = currentDiscount.reduction + ' zł';
			    	}	
			    }
			}
			var matched = false;
			if (this.props.modified !== undefined && this.props.modified !== null && this.props.modified[0]) {
			    this.props.modified.forEach(function(el) {
			    	if (parseInt(product.id) === parseInt(el.id)) {
			    		matched = true;
			    	}
			   	}, this);
			}
			var checkboxOptions = [
			    {id: 1, name: message.additional.deletePhotos, value: 'photo'}, 
			];
			if (!matched) {
				checkboxOptions.push({id: 2, name: message.additional.modify, value: 'productChanged'});
			}
			let activeOptions = [];
			if (this.state.deletePhoto) {
				activeOptions.push(1);
			}
			if (this.state.productUpdated) {
				activeOptions.push(2);
			}
			const activeArray = Config.active;
			const conditionArray = Config.condition;  		
			let tagString = '';
			if (Array.isArray(product.productTags)) {
				product.productTags.forEach((el) => {
				   	tagString = tagString + el.name + ', ';
				});
				if (tagString.length > 2) {
				    tagString = tagString.slice(0, -2);
				}
			}
			let actives = [];
			let activeId = product.active;
			let conditions = [];
			let conditionId = product.condition;
			let manufactorers = [];
			let manufactorerId = product.manufactorer;
			let productCategories = product.productCategories;
			let tempQuantity = product.quantity;
			let curQuantity;
			let quantityText;
			let quantityTextClass = ['col-xs-12', 'col-md-9', 'pull-right', 'textAlignRight'];
			if (tempQuantity) {
				curQuantity = tempQuantity.new;
				if (tempQuantity.new === tempQuantity.old) {
					quantityText = message.quantity.equal;
					quantityTextClass.push('colorSuccess');
				} else {
					quantityText = message.quantity.notEqual + tempQuantity.old;
					quantityTextClass.push('colorWarning');
				}
				quantityTextClass = quantityTextClass.join(' ');
			}
			if (Array.isArray(product.categoryList)) {
				product.categoryList = product.categoryList.map((el) => {
				    el.name = el.metaTitle;
				    return el;
				});
			}
			if (Array.isArray(product.images)) {
				var imageLength = 'Ilość zdjęć: ' + product.images.length;
				var imageList = product.images.map((el) => {
					return <img key={ el } src={ el } style={ imgCss } />
				});
			}
			if (this.state.imageDisplay) {
				var imageContent = (
					<div class="col-xs-12 col-lg-9" style={ cssPadding12 }>
						{imageList}
					</div>
				)
			} else {
				var imageContent = (
					<div class="col-xs-12 col-lg-9">
						<p data-tip={message.actions.showMiniatures} style={ cssPadding12 }><i>{imageLength}</i></p>
						<ReactTooltip />
					</div>
				)
			}
			let image = (
				<div onClick={ this.hideOrShow.bind(this, 'image') }>
				    <Label heightRow="3" name="Zdjęcia:" cssStyle={ cssPadding12 } />
					{imageContent}
				</div>
			);
			let name = (
				<div>
					<Label heightRow="3" name={labels.name.name} />
					<Input heightRow="9" placeholder={labels.name.placeholder} changeHandler={this.inputModify.bind(this)} name="name" noCenter="true" disable={disabled} value={product.name} />
				</div>
			);
			let descShort = (
				<div>
					<Label heightRow="3" name={labels.description.nameShort} />
					<Input heightRow="9" placeholder={labels.description.placeholder} changeHandler={this.inputModify.bind(this)} name="descriptionShort" noCenter="true" disable={disabled} value={product.descriptionShort} />
				</div>
			);
			let description = (
				<div>
					<Label heightRow="3" name={labels.description.nameFull} />
					<div class="col-xs-12 col-md-9">
						<textarea class="form-control" rows="6" onKeyUp={ this.descriptionChange.bind(this) } defaultValue={product.description} disabled={disabled} placeholder={labels.description.placeholder}></textarea>
					</div>
				</div>
			);
			let linkRewrite = (
				<div>
				    <Label heightRow="3" name={labels.linkRewrite.name} />
					<Input heightRow="9" placeholder={labels.linkRewrite.placeholder} changeHandler={this.inputModify.bind(this)} name="linkRewrite" noCenter="true" disable={disabled} value={product.linkRewrite} />
				</div>
			);
			let metaTitle = (
				<div>
				    <Label heightRow="3" name={labels.metaTitle.name} />
					<Input heightRow="9" placeholder={labels.metaTitle.placeholder} changeHandler={this.inputModify.bind(this)} name="metaTitle" noCenter="true" disable={disabled} value={product.metaTitle} />
				</div>
			);
			let metaDescription = (
				<div>
				   	<Label heightRow="3" name={labels.metaDescription.name} />
					<Input heightRow="9" placeholder={labels.metaDescription.placeholder} changeHandler={this.inputModify.bind(this)} name="metaDescription" noCenter="true" disable={disabled} value={product.metaDescription} />
				</div>
			);
			let tags = (
				<div>
				    <Label heightRow="3" name={labels.tags.name} />
					<Input heightRow="9" placeholder={labels.tags.placeholder} changeHandler={this.inputModify.bind(this)} name="productTags" noCenter="true" disable={disabled} value={tagString} />
				</div>	
			);
			let quantity = (
				<div>
				    <Label name={labels.quantity.name} />
					<Input placeholder={labels.quantity.placeholder} changeHandler={this.inputModify.bind(this)} name="quantity" disable={disabled} value={curQuantity} />
					<div class="col-xs-12 col-md-3 pull-left"></div>
					<div class={quantityTextClass}>{quantityText}</div>
				</div>
			);
			let discountNewWarning;
			if (discountNew) {
				let information = product.priceReal.new + message.currency + message.realPrice.suffix + realDiscountNew;
				discountNewWarning = <Warning firstRow="marginTop20px" header={message.realPrice.new} message={ information } currentStyle={centered} />;
			}
			let newPrice = (
				<div>
			    	<Label name={labels.price.nameNew} />
					<Input placeholder={labels.price.placeholder} changeHandler={this.inputModify.bind(this)} name="priceNew" disable={disabled} value={priceNew.toFixed(2)} />
				    {discountNewWarning}
				</div>
			);
			let discountOldWarning;
			if (discountOld) {
				let information = product.priceReal.old + message.currency + message.realPrice.suffix + realDiscountOld;
				discountOldWarning = <Warning firstRow="marginTop20px" header={message.realPrice.old} message={ information } currentStyle={centered} />;
			}
			let oldPrice = (
				<div>
			    	<Label name={labels.price.nameOld} />
					<Input placeholder={labels.price.placeholder} changeHandler={this.inputModify.bind(this)} name="priceOld" disable={disabled} value={priceOld.toFixed(2)} />
			    	{discountOldWarning}
			    </div>
			);
			let noManufactorer = product.manufactorers.findIndex(el => { return el.id === 0 });
			let manufactorersList = [...product.manufactorers];
			if (noManufactorer) {
				manufactorersList.unshift(message.otherManufactorer);
			}
			manufactorersList.forEach((el) => handleSelect(el, manufactorerId, manufactorers));
			var manufactorer = (
				<div>
					<Select selectChange={ this.handleSelectChange.bind(this) } list={ manufactorers } name="manufactorer" title={labels.manufactorer} value={ this.state.manufactorer } disable={disabled}/>
	      		</div>
	      	);
	      	activeArray.forEach((el) => handleSelect(el, activeId, actives));
	      	let active = (
	      		<div>
					<Select selectChange={ this.handleSelectChange.bind(this) } list={ actives } name="active" title={labels.active} value={ this.state.active } disable={disabled}/>
	      		</div>
	      	);
	      	conditionArray.forEach((el) => handleSelect(el, conditionId, conditions));
	      	let condition = (
	      		<div>
					<Select selectChange={ this.handleSelectChange.bind(this) } name="condition" list={ conditions } title={labels.condition} value={ this.state.condition } disable={disabled}/>
	      		</div>
	      	);
	      	saveButton = <input class="form-control btn btn-primary" type="button" value={message.actions.save} onClick={ this.saveFull.bind(this) } />;
		    let urlPath = url.path + String(curId) + '-' + product.linkRewrite + '.html';
		    let categoryLength = message.categoryAmount + product.productCategories.length;
		    let categoryContent = (
		    	<div>
		    		<Label heightRow="3" name="Kategorie:" cssStyle={ cssPadding12 } />
		    		<div class="col-xs-12 col-lg-9">
						<p data-tip={message.actions.showList} style={ cssPadding12 }><i>{categoryLength}</i></p>
						<ReactTooltip />
					</div>
				</div>
			);
			if (this.state.categoryDisplay) {
				var categoryContent = (
					<Checkbox 
						onHandleChange={ this.handleCheckboxChange.bind(this) } 
						active={ productCategories } 
						categories={ product.categories } 
						cssStyle={ cssPadding12 } 
						name="category"
						title={labels.categories} 
		    			toggle={ this.hideOrShow.bind(this) }

					/>
				);
				var categories = (
					<div id="category">
		    			{categoryContent}
		    		</div>
		    	)
			} else {
		    	var categories = (
		    		<div id="category" onClick={ this.hideOrShow.bind(this, 'category') }>
			    		{categoryContent}
			    	</div>
			    )
		    }
		    let additionalOptions = (
		    	<Checkbox 
		    		onHandleChange={ this.handleCheckboxChange.bind(this) } 
		    		onHandleClick="" 
		    		active={ activeOptions } 
		    		categories={ checkboxOptions } 
		    		cssStyle={ cssPadding12 } 
		    		name="checkboxOptions" 
		    		title={message.actions.self} 
		    	/>
		    );
		    content = (
		    	<div>
		    		<h2><a href={urlPath} target="blank">{title}</a></h2>
					{name}
					{descShort}
					{description}
					{linkRewrite}
					{metaTitle}
					{metaDescription}
					{tags}
					{quantity}
					{newPrice}
					{oldPrice}
					{manufactorer}
					{active}
					{condition}
					{categories}
					{image}
					{additionalOptions}
				</div>
			);
			clear = (
				<div>
					<ButtonSingle link="products" classMain="col-xs-12 col-md-3" className="form-control btn btn-info" content={message.actions.clear} />
				</div>
			);
			if (this.props.list) {
				goBack = (
					<div class="col-xs-12 col-md-3 pull-left">
						<input class="form-control btn btn-info pull-right" type="button" value={message.actions.goBackToList} onClick={ () => this.props.goBack() } />
					</div>
				);
			}
			buttons = (
				<div>
					<div class="col-xs-12 col-md-3">
						{saveButton}
					</div>
					<ButtonSingle link={curUrl} classMain="col-xs-12 col-md-3" className="form-control btn btn-info" content={message.actions.history} />
					{clear}
					{goBack}
				</div>
			);
			rightColumnClass = 'col-xs-12 col-lg-9';
			return (
				<div class="container bgrContent paddingBottom2 paddingTop2 marginTop2 borderRadius10">
					{leftColumn}
					<div class={rightColumnClass}>
						{content} 
						{buttons}
					</div>
				</div>
			);
		} else {
			return (
				<Busy title={message.editionSearch} />
			);
		}
	}
}
