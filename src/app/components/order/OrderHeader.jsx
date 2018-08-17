import React from 'react';

import Config from '../../Config';
import Label from '../dumb/Label.jsx';
import Select from '../dumb/Select.jsx';
import Title from '../dumb/Title.jsx';

import setCurrentId from '../../functions/order/setId';
import setSearch from '../../functions/order/setSearch';
import setSelectData from '../../functions/order/setData';

const orderHeader = ( props ) => {
	const handleSelectChange = (e) => props.setData(setSelectData(e, props.header));
	const setId = (e) => {
		let check = isNaN(e.target.value);
		if (!check) {
			props.setData(setCurrentId(e, props.header, props.error));
		} else {
			let curError = {...props.error, value: e.target.value};
			curError[e.target.name] = true;
			props.setError(curError);
		}
	};
	const setIdSearch = () => props.search(setSearch(props.header));

	let actionId = props.header.actionId;
	let currentSelect = props.header.currentSelect;
	let headerDisable = props.headerDisable;
	let panelId = props.header.panelId;
	let selected = props.header.selected;
	let actions = Config.orderActions;
	let panels = Config.orderPanels;
	let message = Config.message;
	let actionOptions = actions.map((el, index) => {
		return <option key={index + 1} value={el.id}>{el.name}</option>;
	});
	if (!currentSelect || !selected.action) {
		let checkId = actions.findIndex((el) => { return el.id === 0; });
		if (checkId === -1) {
			actionOptions.unshift(<option key="0" value={ message.pleaseChoose.id }>{ message.pleaseChoose.name }</option>);
		}
	}
	let panelOptions = panels.map((el, index) => {
		return <option key={index + 1} value={el.id}>{el.name}</option>;
	});
	if (!currentSelect || !selected.panel) {
		let checkId = panels.findIndex((el) => { return el.id === 0; });
		if (checkId === -1) {
			panelOptions.unshift(<option key="0" value={ message.pleaseChoose.id }>{ message.pleaseChoose.name }</option>);
		}
	}
	let classAction = props.error.actionId ? 'form-control borderWarning textAlignCenter' : 'form-control textAlignCenter';
	let classPanel = props.error.panelId ? 'form-control borderWarning textAlignCenter' : 'form-control textAlignCenter';
	return(
		<div class="container bgrContent borderRadius10 marginTop40px paddingBottom40px">
			<div class="col-xs-12">
				<Title title={message.title.orders} />
			</div>
			<div class="col-xs-12 pull-left marginTop20px">
				<div class="col-xs-12">
					<div class="col-xs-12 col-md-6">
						<Select
							curClass="col-xs-12 marginBottom10px"
							setDisabled={props.disable}
							list={ panelOptions }
							name="panel"
							selectChange={ handleSelectChange.bind(this) }
							title={message.orders.choosePanel}
							value={ selected.panel }
						/>
					</div>
					<div class="col-xs-12 col-md-3">
						<input class={classPanel} type="text" disabled={props.disable} name="panelId" value={panelId} placeholder={message.labels.receipt} onChange={ setId.bind(this) } />
					</div>
					<div class="col-xs-12 col-md-3">
						<input class="form-control btn btn-primary cursorPointer" disabled={props.disable || headerDisable.panel} type="button" value={message.orders.find} onClick={ setIdSearch.bind(this) } />
					</div>
				</div>
				<div class="col-xs-12">
					<div class="col-xs-12 col-md-6">
						<Select
							curClass="col-xs-12 marginBottom10px"
							setDisabled={props.disable}
							list={ actionOptions }
							name="action"
							selectChange={ handleSelectChange.bind(this) }
							title={message.orders.chooseAction}
							value={ selected.action }
						/>
					</div>
					<div class="col-xs-12 col-md-3">
						<input class={classAction} type="text" disabled={props.disable} name="actionId" value={actionId} placeholder={message.labels.receipt} onChange={ setId.bind(this) } />
					</div>
					<div class="col-xs-12 col-md-3">
						<input class="form-control btn btn-primary cursorPointer" disabled={props.disable || headerDisable.action} type="button" value={message.orders.find} onClick={ setIdSearch.bind(this) } />
					</div>
				</div>
			</div>
		</div>
	);
};

export default orderHeader;
