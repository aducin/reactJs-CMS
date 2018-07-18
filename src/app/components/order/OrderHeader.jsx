import React from 'react';

import Config from '../../Config';
import Label from '../dumb/Label.jsx';
import Select from '../dumb/Select.jsx';
import Title from '../dumb/Title.jsx';

const orderHeader = ( props ) => {
	const handleSelectChange = (e) => {
		let header = props.header;
		let name = e.target.name;
		let curSelected = {
			action: 0,
			panel: 0
		};
		curSelected[e.target.name] = e.target.value;
		let curActionId = name === 'action' ? header.actionId : '';
		let curPanelId = name === 'panel' ? header.panelId : '';
		let data = {
			header: {
				actionId: curActionId,
				currentSelect: name,
				name: name + 'Id',
				panelId: curPanelId,
				selected: curSelected
			},
			updateError: false
		};
		props.setData(data);
	};
	const setId = (e) => {
		let header = props.header;
		let name = e.target.name;
		let value = e.target.value;
		let check = isNaN(value);
		let curAction = name === 'actionId' ? header.selected.action : 0;
		let curPanel = name === 'panelId' ? header.selected.panel : 0;
		let selected = {
			action: curAction,
			panel: curPanel
		};
		if (!check) {
			let curError = {...props.error};
			curError[name] = false;
			let actionName = name.replace('Id', '');
			let curActionId = name === 'actionId' ? value : '';
			let curPanelId = name === 'panelId' ? value : '';
			let data = {
				error: curError,
				header: {
					actionId: curActionId,
					currentSelect: actionName,
					name: name,
					panelId: curPanelId,
					selected: selected
				},
				updateError: true
			};
			props.setData(data);
		} else {
			let curError = {...props.error};
			curError[name] = true;
			curError.value = value;
			props.setError(curError);
		}
	};
	const setIdSearch = () => {
		let header = props.header;
		let id = header.currentSelect === 'action' ? header.actionId : header.panelId;
		let selectedId = header.currentSelect === 'action' ? header.selected.action : header.selected.panel;
		let actions = [...Config.orderActions];
		let panels = [...Config.orderPanels];
		let concated = actions.concat(panels);
		let action;
		let idCheck = concated.findIndex((el) => { return parseInt(el.id) === parseInt(selectedId); });
		if (idCheck !== -1) {
			action = concated[idCheck].action;
		}
		let data = {
			action: action,
			id: id,
			selected: selectedId
		};
		props.search(data);
	};
	let actionId = props.header.actionId;
	let currentSelect = props.header.currentSelect;
	let error = props.error;
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
	let classAction = error.actionId ? 'form-control borderWarning textAlignCenter' : 'form-control textAlignCenter';
	let classPanel = error.panelId ? 'form-control borderWarning textAlignCenter' : 'form-control textAlignCenter';
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
}

export default orderHeader;

