import React from 'react';
import ReactDOM from 'react-dom';

import mainModelInstance from '../../model/mainModel';
import productModelInstance from '../../model/productModel';
import ProductModel from '../../model/productModel';
import { activeOptions } from '../../functions/product/edition/activeOptions';
import { checkBoxChange } from '../../functions/product/edition/checkBoxChange';
import { checkBoxOptions } from '../../functions/product/edition/checkBoxOptions';
import { equalState as prepareEqual } from '../../functions/product/edition/equalState';
import { inputModify as modify } from '../../functions/product/edition/inputModify';
import { prepareOptions } from '../../functions/product/edition/prepareOptions';
import { prepareSave } from '../../functions/product/edition/prepareSave';
import { selectChange } from '../../functions/product/edition/selectChange';
import { setTags } from '../../functions/product/edition/setTags';
import { updateCategoryList } from '../../functions/product/edition/updateCategoryList';
import { handleSelectOpts, setContent } from '../../functions/jsx/productEdition.jsx';

import Config from '../../Config';
import { Edition as EditionState } from '../../helper/productState';

import Busy from '../dumb/Busy.jsx';
import Buttons from './edition/Buttons.jsx';
import Categories from './edition/Categories.jsx';
import Checkbox from '../dumb/Checkbox.jsx';
import Description from './edition/Description.jsx';
import Edition from './edition/Edition.jsx';
import Images from './edition/Images.jsx';
import Price from './edition/Price.jsx';
import Quantity from './edition/Quantity.jsx';
import Select from '../dumb/Select.jsx';

export default class ProductEdition extends React.Component {
	constructor(props) {
		super(props);
		this.mainModel = mainModelInstance;
		this.model = productModelInstance();
		this.state = EditionState;
	}

	componentWillUpdate(nextProps, nextState) {
		this.equalState(nextProps, nextState);
	}

	descriptionChange = (e) => {
		this.setState({ description: e.target.value });
	};
	equalState(props, state) {
		if (state.id !== props.productData.dataFull.id) {
			this.setState(prepareEqual(this.state, props.productData.dataFull));
		}
	}
	handleCheckboxChange = (list, origin) => {
		this.setState(checkBoxChange(this.state, list, origin));
	};
	handleSelectChange(e) {
		this.setState(selectChange(this.state, e));
	};
	hideOrShow = (field) => {
		let categoryDisplay = field === 'category' ? !this.state.categoryDisplay : this.state.categoryDisplay;
		let imageDisplay = field === 'image' ? !this.state.imageDisplay : this.state.imageDisplay;
		this.setState({ categoryDisplay, imageDisplay });
	};
	inputModify = (data) => {
		this.setState( modify(this.state, data) );
	};
	saveFull = () => {
		window.scrollTo(0, 0);
		let data = prepareSave(this.state);
		let attribute = this.props.productData.dataFull.attribute;
		this.model.saveProduct(attribute.new, attribute.old, Config.ajaxConfig, data)
			.then((response) => {
				let action = response.data.success ? 'success' : 'warning';
				this.mainModel.setMessage(action, response.data.reason);
			})
			.catch((err) => this.mainModel.setMessage(action, err.message))
	};

	render() {
		const message = Config.message;
		const product = this.props.productData.dataFull;
		let disabled = Boolean(this.props.disable);
		if (product && product.id !== undefined && product.id !== 0) {
			product.categoryList = updateCategoryList(product.categoryList);
			let image = <Images images={product.images} display={this.state.imageDisplay} action={this.hideOrShow}/>;
			let name = <Edition type="name" action={this.inputModify} disabled={disabled} value={product}/>;
			let descShort = <Edition type="descriptionShort" action={this.inputModify} disabled={disabled} value={product}/>;
			let description = <Description product={product} action={this.descriptionChange} disabled={disabled} />;
			let linkRewrite = <Edition type="linkRewrite" action={this.inputModify} disabled={disabled} value={product}/>;
			let metaTitle = <Edition type="metaTitle" action={this.inputModify} disabled={disabled} value={product}/>;
			let metaDesc = <Edition type="metaDescription" action={this.inputModify} disabled={disabled} value={product}/>;
			let tags = <Edition type="tags" action={this.inputModify} disabled={disabled} value={setTags(product.productTags)}/>;
			let quantity = <Quantity product={product} disabled={disabled} action={this.inputModify} />;
			let newPrice = <Price type="new" product={product} action={this.inputModify} disabled={disabled} />;
			let oldPrice = <Price type="old" product={product} action={this.inputModify} disabled={disabled} />;
			let manufactorer = (
				<Select
					selectChange={ this.handleSelectChange.bind(this) }
					list={ handleSelectOpts(prepareOptions(product.manufactorers)) }
					name="manufactorer" title={message.labels.manufactorer} value={ this.state.manufactorer } disable={disabled} curClass=""
				/>
			);
			let active = (
				<Select
					selectChange={ this.handleSelectChange.bind(this) }
					list={ handleSelectOpts(Config.active) }
					name="active" title={message.labels.active} value={ this.state.active } disable={disabled} curClass=""
				/>
			);
			let condition = (
				<Select
					selectChange={ this.handleSelectChange.bind(this) }
					list={ handleSelectOpts(Config.condition) }
					name="condition"  title={message.labels.condition} value={ this.state.condition } disable={disabled} curClass=""
				/>
			);
			let display = this.state.categoryDisplay;
			let checkAct = this.handleCheckboxChange;
			let categories = <Categories product={product} display={display} action={this.hideOrShow} checkAct={checkAct} />;
			let options = checkBoxOptions(this.props.modified, product.id);
			let additional = (
				<Checkbox
					onHandleChange={ this.handleCheckboxChange.bind(this) }
					active={ activeOptions(this.state.deletePhoto, this.state.productUpdated) }
					categories={ options } cssStyle={ Config.css.padding12 } name="checkboxOptions" title={message.actions.self}
				/>
			);
			let buttons = <Buttons product={product} list={this.props.list} save={this.saveFull} back={this.props.goBack} />;
			return setContent(product, name, descShort, description, linkRewrite, metaTitle, metaDesc, tags, quantity,
				newPrice, oldPrice, manufactorer, active, condition, categories, image, additional, buttons);
		} else {
			return <Busy title={message.editionSearch} />;
		}
	}
}
