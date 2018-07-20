import React from 'react';
import ReactDOM from 'react-dom';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { reactLocalStorage } from 'reactjs-localstorage';

import axios from 'axios';
import store from '../../store';
import * as product from '../../actions/productActions.jsx';
import Config from '../../Config';
import Helper from '../../helper/Helper.jsx';
import ProductModel from '../../model/productModel';
import Busy from '../dumb/Busy.jsx';
import ButtonSingle from '../dumb/ButtonSingle.jsx';
import Input from '../dumb/Input.jsx';
import Label from '../dumb/Label.jsx';
import Title from '../dumb/Title.jsx';

@connect((store) => {
    return { product: store.product };
}) 

export default class BasicEdition extends React.Component {
	constructor(props) {
		super(props);	    
		this.state = {
			borderWarning: 'borderWarning',
			classWarning: 'colorWarning',
			doNotUpdateProps: false,
			disabled: false,
			disabledSave: true,
			discount: {},
			error: {},
			errorFields: ['name', 'quantity', 'price'],
			fields: ['id', 'name', 'quantity', 'price', 'discount'],
			id :null,
			message: undefined,
			messageType: undefined,
			name: null,
			price: {},
			quantity: {},
			save: false,
			setDisabledSave: false,
			setTimeout: false,
			showModal: false
		}
	}

	componentDidUpdate() {
    	if (this.state.save) {
				this.save();
			}
	}
	componentWillUpdate(nextProps, nextState) {
		if (nextState.setDisabledSave && !this.state.setDisabledSave) {
			this.setDisabledSave();
		} else if (this.state.save) {
			this.setState({ save: false });
		} else if (nextState.setDisabledSave) {
			this.setState({ setDisabledSave: false });
		} else if (nextState.setTimeout) {
			this.setTimeout(nextState);
		} else {
			this.equalState(nextProps);
		}
	}

	equalState(props) {
		let newId = this.state.id !== props.dataBasic.id;
		if (props.dataReceived && newId) {
			let data = {...props.dataBasic};
			this.setState({
				id: data.id,
				discount: data.discount,
				name: data.name,
				quantity: data.quantity,
				price: {...data.price},
				showModal: true
			});
		}
	}
	inputChange(e) {
		const checkFloat = (value) => {
			return !isNaN(value) && value.toString().indexOf('.') != -1;
		};
		let name = e.target.name;
		let value = e.target.value;
		let curError = {...this.state.error};
		if (name === 'name') {
			curError.name = value.length < 3;
			this.setState({
				error: curError,
				name: value,
				setDisabledSave: true
			});
		} else if (name === 'amount') {
			let intCheck = isNaN(value) || value.length === 0;
			curError.quantity = intCheck;
			let curQuantity = Boolean(intCheck) ? this.state.quantity : { new: parseInt(value), old: parseInt(value) };
			this.setState({
				error: curError,
				quantity: curQuantity,
				setDisabledSave: true
			});
		} else if (name === 'price') {
			let priceCheck = isNaN(value.replace(',', '.')) || value.length === 0;
			curError.price = priceCheck;
			let curPrice = Boolean(priceCheck) ? this.state.price : { new: value, old: value };
			this.setState({
				error: curError,
				price: curPrice,
				setDisabledSave: true
			});
		}
	};
	modalClose() {
		this.props.close();
	};
	save() {
		let newAttr = this.props.dataBasic.attribute.new;
		let oldAttr = this.props.dataBasic.attribute.old;
		let data = {
			db: 'both',
			id: this.state.id,
			name: this.state.name,
			quantity: this.state.quantity.old,
			token: this.props.token
		};
		if (!this.state.discount.new && !this.state.discount.old) {
			data.price = this.state.price.old;
		}
		ProductModel.basicEdition(data, newAttr, oldAttr, this.state.config)
			.then((response) => {
				let messageType = Boolean(response.data.success) ? 'success' : 'error';
				this.setMessage(messageType, response.data.reason);
			})
			.catch((err) =>{
				this.setMessage('error', Config.message.error);
			});
	}
	setSave() {
		this.setState({
			disabled: true,
			disabledSave: true,
			doNotUpdateProps: false,
			save: true
		});	
	}
	setDisabledSave() {
		let disabled = false;
		this.state.errorFields.forEach((el) => {
			if (this.state.error[el]) {
				disabled = true;
			}
		});
		this.setState({
			disabledSave: disabled,
			doNotUpdateProps: true
		});
	}
	setMessage(type, text) {
		let curClass = type === 'success' ?  'colorSuccess' : 'colorWarning';
		this.setState({
			message: text,
			messageType: curClass,
			setTimeout: true
		});
	}
	setTimeout(state) {
		let success = state.messageType === 'colorSuccess';
		setTimeout(() => {
			if (success) {
				store.dispatch(product.clearBasic());
				this.modalClose();
			} else {
				this.setState({
					disabled: false,
					disabledSave: false,
					message: undefined,
					messageType: undefined,
					setTimeout: false
				});
			}
		}, Config.timer);
	}

	render() {
		const centered = {
			display: 'block',
			margin: 'auto',
			border: '1px solid #C8C8C8',
			borderRadius: '10px'
		};
		const checkWarning = (field, warning) => {
			return this.state.error[field] ? this.state[warning] : null;
		}
		const setWarning = (text, data) => {
			return (
				<div>
					<div class="col-xl-12 col-md-4 pull-left"></div>
					<div class="col-xl-12 col-md-8 pull-left colorWarning marginTop10px textAlignCenter">{text}<i>{data}</i></div>
				</div>
			);
		};
		let bodyHeight = { minHeight: 540};
		let text = Config.message;
		let url = Config.url;
		if (this.props.dataReceived) {
			let data = {};
			this.state.fields.forEach((el) => {
				if (this.state.doNotUpdateProps) {
					data[el] = this.state[el];
				} else {
					data[el] = this.props.dataBasic[el];
				}
			});
			let disabled = this.state.disabled;
			let disabledPrice = this.state.disabled;
			let disabledSave = this.state.disabledSave;
			let name, price, quantity;
			let priceNew, priceOld, discountNew, discountOld, priceMessage, priceNet = null;
			let editionUrl = 'products/edition/' + data.id;
			let historyUrl = 'products/history/' + data.id;
			let imageId = this.props.dataBasic.image;
			let imagePath = url.path + 'img/p/' + data.id + '-' + imageId + '-thickbox.jpg';
			let title = this.state.message ? this.state.message : text.simpleEdition + data.id;
			let titleStyle = this.state.message ? this.state.messageType : null;
			let cachedId = reactLocalStorage.get('searchId');
			let nameBorder = checkWarning('name', 'borderWarning');
			let nameError = checkWarning('name', 'classWarning');
			name = (
				<div class="marginTop20px paddingBottom30px">
					<Label labelClass={nameError} heightRow="4" name="Nazwa:" />
					<Input additionalClass={nameBorder} heightRow="8" placeholder="Podaj nazwę" changeHandler={ (e) => this.inputChange(e) } name="name" value={data.name} disable={ disabled }/>
				</div>
			);
			let quantityBorder = checkWarning('quantity', 'borderWarning');
			let quantityError = checkWarning('quantity', 'classWarning');
			let quantityWarning = (data.quantity.old !== data.quantity.new && !isNaN(data.quantity.old)) ? setWarning(text.differentQuantities, data.quantity.new) : null;
			bodyHeight.minHeight = data.quantity.old !== data.quantity.new ? bodyHeight.minHeight + 27 : bodyHeight.minHeight;
			quantity = (
				<div>
					<Label labelClass={quantityError} heightRow="4" name="Ilość:" />
					<Input additionalClass={quantityBorder} heightRow="8" placeholder="Podaj ilość" changeHandler={ (e) => this.inputChange(e) } name="amount" value={data.quantity.old} disable={ disabled }/>
					{quantityWarning}
				</div>
			);
			priceNew = parseFloat(data.price.new);
			priceOld = parseFloat(data.price.old);
			if (data.discount.new || data.discount.old) {
				if (data.discount.new) {
					let curDiscount = parseFloat(data.price.new) * parseFloat(data.discount.new.reduction);
					priceNew = parseFloat(priceNew - curDiscount);
					priceNet = setWarning(text.discountNet + data.price.new + text.currency);
					discountNew = setWarning(text.discount.new + curDiscount + '%');
					bodyHeight.minHeight += 54;
				}
				if (data.discount.old) {
					priceOld = parseFloat(data.price.old - data.discount.old.reduction);
					priceNet = setWarning(text.discountNet + data.price.old + text.currency);
					discountOld = setWarning(text.discount.old + data.discount.old.reduction + text.currency);
					bodyHeight.minHeight += 54;
				}
				priceMessage = setWarning(text.priceDisabled, '');
				disabledPrice = true;
				bodyHeight.minHeight += 27;
			}
			let priceBorder = checkWarning('price', 'borderWarning');
			let priceError = checkWarning('price', 'classWarning');
			let finalText = text.differentPrices + priceNew.toFixed(2) + text.currency;
			let priceWarning = priceNew !== priceOld ? setWarning(finalText) : null;
			bodyHeight.minHeight = priceNew !== priceOld ? bodyHeight.minHeight + 27 : bodyHeight.minHeight;
			price = (
				<div>
					<Label labelClass={priceError} heightRow="4" name="Cena:" />
					<Input additionalClass={priceBorder} heightRow="8" placeholder="Podaj cenę" changeHandler={ (e) => this.inputChange(e) } name="price" value={priceOld.toFixed(2)} disable={ disabledPrice }/>
					{priceWarning}
					{priceNet}
					{discountOld}
					{discountNew}
					{priceMessage}
				</div>
			);
			let priceDisabled = (data.discount.new !== false || data.discount.old !== false);
			bodyHeight.minHeight = bodyHeight.minHeight + 'px';
			if (parseInt(cachedId) === parseInt(data.id)) {
				return (
					<Modal show={ this.state.showModal } onHide={ this.modalClose.bind(this) }>
						<Modal.Header closeButton>
							<Modal.Title class={titleStyle}>{title}</Modal.Title>
						</Modal.Header>
						<Modal.Body style={bodyHeight}>
							<div class="marginTop10px">
								<img src={imagePath} alt={data.name} style={centered} height="350" width="350" />
							</div>
							{name}
							<div class="col-xs-12 marginTop10px"></div>
							{quantity}
							<div class="col-xs-12 marginTop10px"></div>
							{price}
						</Modal.Body>
						<Modal.Footer>
							<div class="col-xs-12 pull-left marginTop10px">
								<div class="col-xs-12 col-md-3 pull-left">
									<input class="form-control btn btn-primary pull-right" disabled={ disabledSave } type="button" value="Zapisz" onClick={ this.setSave.bind(this) } />
								</div>
								<ButtonSingle link={editionUrl} classMain="col-xs-12 col-md-3" className="form-control btn btn-info" content="Pełna edycja" />
								<ButtonSingle link={historyUrl} classMain="col-xs-12 col-md-3" className="form-control btn btn-info" content="Historia" />
								<div class="col-xs-12 col-md-3 pull-left">
									<input class="form-control btn btn-info pull-right" type="button" value="Zamknij" onClick={ this.modalClose.bind(this) } />
								</div>
							</div>
						</Modal.Footer>
					</Modal>
				);
			} else {
				return(
					<Busy title={text.singleEditionAnother} />
				)
			}
		} else {
			return(
				<Busy title={text.loading} />
			);
		}
	}
}
