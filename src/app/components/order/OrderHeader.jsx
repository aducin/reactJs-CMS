import React from 'react';

import Config from '../../Config';
import Label from '../dumb/Label.jsx';
import Select from '../dumb/Select.jsx';
import Title from '../dumb/Title.jsx';

export default class OrderHeader extends React.Component {

	checkDisabled(name) {
		let header = this.props.header;
		let curDisable = {
			action: true,
			panel: true
		};
		let shortenName = name.replace('Id', '');
		let isNaNCheck = Boolean(isNaN(header[name]) || header[name] === '');
		if (header.selected[shortenName] !== 0 && !this.props.error[name] && !isNaNCheck) {
			curDisable[shortenName] = false;
		}
		this.setState({
			disable: curDisable
		});
	}

	handleSelectChange(e) {
		let header = this.props.header;
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
		this.props.setData(data);

		this.setState({
			actionId: curActionId,
			currentSelect: e.target.name,
			panelId: curPanelId,
			selected: curSelected
		}, () => {
			this.checkDisabled(name + 'Id');
		});
	}

	setId(e) {
		let header = this.props.header;
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
			let curError = {...this.props.error};
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
			this.props.setData(data);
			this.setState({
				actionId: curActionId,
				currentSelect: actionName,
				error: curError,
				panelId: curPanelId,
				selected: selected
			}, () => {
				this.checkDisabled(name);
			});
		} else {
			let curError = {...this.props.error};
			curError[name] = true;
			this.props.setError(curError);
		}
	}

	setIdSearch() {
		let header = this.props.header;
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
		this.props.search(data);
	}

	render() {
		let actionId = this.props.header.actionId;
		let currentSelect = this.props.header.currentSelect;
		let error = this.props.error;
		let headerDisable = this.props.headerDisable;
		let panelId = this.props.header.panelId;
		let selected = this.props.header.selected;
		let actions = Config.orderActions;
		let panels = Config.orderPanels;
		let message = Config.message;
		var actionOptions = actions.map((el, index) => {
      		return <option key={index + 1} value={el.id}>{el.name}</option>;
      	});
      	if (!currentSelect || !selected.action) {
      		let checkId = actions.findIndex((el) => { return el.id === 0; });
      		if (checkId === -1) {
      			actionOptions.unshift(<option key="0" value={ message.pleaseChoose.id }>{ message.pleaseChoose.name }</option>);
      		}
      	}
		var panelOptions = panels.map((el, index) => {
      		return <option key={index + 1} value={el.id}>{el.name}</option>;
      	});
      	if (!currentSelect || !selected.panel) {
      		let checkId = panels.findIndex((el) => { return el.id === 0; });
      		if (checkId === -1) {
      			panelOptions.unshift(<option key="0" value={ message.pleaseChoose.id }>{ message.pleaseChoose.name }</option>);
      		}
      	}
      	let classAction = error.actionId !== false ? 'form-control borderWarning textAlignCenter' : 'form-control textAlignCenter';
		let classPanel = error.panelId !== false ? 'form-control borderWarning textAlignCenter' : 'form-control textAlignCenter';
		return (
    		<div class="container bgrContent borderRadius10 marginTop40px paddingBottom40px">
				<div class="col-xs-12">
					<Title title={message.title.orders} />
				</div>
				<div class="col-xs-12 pull-left marginTop20px">
				    <div class="col-xs-12">
					    <div class="col-xs-12 col-md-6">
					        <Select 
					      		curClass="col-xs-12 marginBottom10px" 
					      		setDisabled={this.props.disable} 
					      		list={ panelOptions } 
					      		name="panel" 
					      		selectChange={ this.handleSelectChange.bind(this) } 
					      		title={message.orders.choosePanel}
					      		value={ selected.panel }
					      	/>
					    </div>
					    <div class="col-xs-12 col-md-3">
							<input class={classPanel} type="text" disabled={this.props.disable} name="panelId" value={panelId} placeholder={message.labels.receipt} onChange={ this.setId.bind(this) } />
						</div>
						<div class="col-xs-12 col-md-3">
							<input class="form-control btn btn-primary cursorPointer" disabled={this.props.disable || headerDisable.panel} type="button" value={message.orders.find} onClick={ this.setIdSearch.bind(this) } />
						</div>
					</div>
			    	<div class="col-xs-12">
					    <div class="col-xs-12 col-md-6">
					        <Select 
					      		curClass="col-xs-12 marginBottom10px" 
					      		setDisabled={this.props.disable} 
					      		list={ actionOptions } 
					      		name="action" 
					      		selectChange={ this.handleSelectChange.bind(this) } 
					      		title={message.orders.chooseAction}
					      		value={ selected.action }
					      	/>
					    </div>
					    <div class="col-xs-12 col-md-3">
							<input class={classAction} type="text" disabled={this.props.disable} name="actionId" value={actionId} placeholder={message.labels.receipt} onChange={ this.setId.bind(this) } />
						</div>
						<div class="col-xs-12 col-md-3">
							<input class="form-control btn btn-primary cursorPointer" disabled={this.props.disable || headerDisable.action} type="button" value={message.orders.find} onClick={ this.setIdSearch.bind(this) } />
						</div>
					</div>
			    </div>
			</div>
    	)
	}
}
