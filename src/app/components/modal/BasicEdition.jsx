import React from 'react';
import ReactDOM from 'react-dom';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { reactLocalStorage } from 'reactjs-localstorage';

import store from '../../store';
import * as product from '../../actions/productActions.jsx';
import { Basic } from '../../helper/productState';
import Config from '../../Config';
import Helper from '../../helper/Helper.jsx';
import productModelInstance from '../../model/productModel';
import Busy from '../dumb/Busy.jsx';
import ButtonSingle from '../dumb/ButtonSingle.jsx';
import { changeInput } from '../../functions/product/basicModal/changeInput';
import { checkWarning } from '../../functions/product/basicModal/checkWarning';
import Name from '../product/basic/Name.jsx';
import { prepareSaveData } from '../../functions/product/basicModal/prepareSaveData';
import Price from '../product/basic/Price.jsx';
import Quantity from '../product/basic/Quantity.jsx';
import { setContent, setFooter } from '../../functions/jsx/basicEdition.jsx';
import { setData } from '../../functions/product/basicModal/setData';
import { setDisabled } from '../../functions/product/basicModal/setDisabled';
import { setEqualState } from '../../functions/product/basicModal/setEqualState';
import { setHeight } from '../../functions/product/basicModal/setHeight';
import { setTimeoutData } from '../../functions/product/basicModal/setTimeoutData';
import Title from '../dumb/Title.jsx';

@connect((store) => {
    return { product: store.product };
}) 

export default class BasicEdition extends React.Component {
	constructor(props) {
		super(props);
		this.model = productModelInstance();
		this.state = Basic;
	}

	componentDidUpdate(previousProps, previousState) {
		if (this.state.save) {
			this.save();
		} else if (this.state.setTimeout) {
			this.setTimeout();
		} else if (this.state.setDisabledSave && !previousState.setDisabledSave) {
			this.setDisabledSave();
		}
	}
	static getDerivedStateFromProps(nextProps, previousState) {
		if (nextProps.received && previousState.id !== nextProps.data.id) {
			return setEqualState(nextProps.data);
		}
		return null;
	}

	inputChange = (e) => this.setState(changeInput(e, this.state));

	modalClose = () => this.props.close();

	save() {
		let data = prepareSaveData(this.state, this.props.token);
		this.model.basicEdition(data, this.props.data.attribute.new, this.props.data.attribute.old, this.state.config)
			.then((response) => {
				let messageType = Boolean(response.data.success) ? 'success' : 'error';
				this.setMessage(messageType, response.data.reason);
			})
			.catch((err) => this.setMessage('error', Config.message.error))
			.finally(() => this.setState({ save: false }));
	}

	setSave = () => this.setState({ disabled: true, disabledSave: true, doNotUpdateProps: false, save: true });

	setDisabledSave = () => {
		this.setState({ disabledSave: setDisabled(this.state), doNotUpdateProps: true, setDisabledSave: false });
	};

	setMessage(type, text) {
		let curClass = type === 'success' ?  'colorSuccess' : 'colorWarning';
		this.setState({ message: text, messageType: curClass, setTimeout: true });
	}
	setTimeout() {
		setTimeout(() => {
			if (this.state.messageType === 'colorSuccess') {
				store.dispatch(product.clearBasic());
				this.modalClose();
			} else {
				this.setState( setTimeoutData() );
			}
		}, Config.timer);
	}

	render() {
		if (this.props.received) {
			let data = setData(this.state, this.props);
			let disabled = this.state.disabled;
			let title = this.state.message ? this.state.message : Config.message.simpleEdition + data.id;
			let titleStyle = this.state.message ? this.state.messageType : null;
			let name = <Name action={this.inputChange} disabled={disabled} name={data.name} state={this.state} />;
			let quantity = <Quantity action={this.inputChange} data={data} disabled={disabled} state={this.state} />;
			let price = <Price data={data} state={this.state} />;
			let content = setContent(data, name, quantity, price, this.props.data.image);
			let footer = setFooter(data, this.state.disabledSave, this.modalClose, this.setSave);
			if (parseInt(reactLocalStorage.get('searchId')) === parseInt(data.id)) {
				return (
					<Modal show={ this.state.showModal } onHide={ this.modalClose.bind(this) }>
						<Modal.Header closeButton>
							<Modal.Title class={titleStyle}>{title}</Modal.Title>
						</Modal.Header>
						<Modal.Body style={setHeight(data)}>
							{ content }
						</Modal.Body>
						<Modal.Footer>
							{ footer }
						</Modal.Footer>
					</Modal>
				);
			} else {
				return <Busy title={Config.message.singleEditionAnother} />;
			}
		} else {
			return <Busy title={Config.message.loading} />;
		}
	}
}
