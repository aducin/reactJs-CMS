import React from 'react';

import Label from '../dumb/Label.jsx';
import Select from '../dumb/Select.jsx';
import Title from '../dumb/Title.jsx';

export default class OrderHeader extends React.Component {
	constructor(props) {
		super(props);	 
		this.state = {
			actionId: '',
			currentSelect: null,
			disable: {
				action: true,
				panel: true
			},
			error: {
				actionId: false,
				panelId: false
			},
			panelId: '',
			selected: {
				action: 0,
				panel: 0
			}
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.clear) {
			this.setState({
				actionId: '',
				currentSelect: null,
				panelId: '',
				selected: {
					action: 0,
					panel: 0
				}
			});
		}
	}

	checkDisabled(name) {
		let curDisable = {
			action: true,
			panel: true
		};
		let shortenName = name.replace('Id', '');
		let isNaNCheck = Boolean(isNaN(this.state[name]) || this.state[name] === '');
		//if (this.state.currentSelect === shortenName && !this.state.error[name] && !isNaNCheck) {
		if (this.state.selected[shortenName] !== 0 && !this.state.error[name] && !isNaNCheck) {
			curDisable[shortenName] = false;
		}
		this.setState({
			disable: curDisable
		});
	}

	handleSelectChange(e) {
		let name = e.target.name;
		let value = e.target.value;
		let curSelected = {
			action: 0,
			panel: 0
		};
		curSelected[e.target.name] = e.target.value;
		let curActionId = name === 'action' ? this.state.actionId : '';
		let curPanelId = name === 'panel' ? this.state.panelId : '';
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
		let name = e.target.name;
		let value = e.target.value;
		let check = isNaN(value);
		let curAction = name === 'actionId' ? this.state.selected.action : 0;
		let curPanel = name === 'panelId' ? this.state.selected.panel : 0;
		let selected = {
			action: curAction,
			panel: curPanel
		};
		if (!check) {
			let curState = {...this.state};
			let curError = {...this.state.error};
			curError[name] = false;
			let actionName = name.replace('Id', '');
			let curActionId = name === 'actionId' ? value : '';
			let curPanelId = name === 'panelId' ? value : '';
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
			let curError = {...this.state.error};
			curError[name] = true;
			this.setState({
				error: curError
			});
		}
	}

	setIdSearch() {
		let id = this.state.currentSelect === 'action' ? this.state.actionId : this.state.panelId;
		let selectedId = this.state.currentSelect === 'action' ? this.state.selected.action : this.state.selected.panel;
		let actions = [...this.props.actions];
		let panels = [...this.props.panels];
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
		let actionId = this.state.actionId;
		let panelId = this.state.panelId;
		let actions = this.props.actions;
		let panels = this.props.panels;
		let message = this.props.message;
		var actionOptions = actions.map((el, index) => {
      		return <option key={index + 1} value={el.id}>{el.name}</option>;
      	});
      	if (!this.state.currentSelect || !this.state.selected.action) {
      		let checkId = actions.findIndex((el) => { return el.id === 0; });
      		if (checkId === -1) {
      			actionOptions.unshift(<option key="0" value={ message.pleaseChoose.id }>{ message.pleaseChoose.name }</option>);
      		}
      	}
		var panelOptions = panels.map((el, index) => {
      		return <option key={index + 1} value={el.id}>{el.name}</option>;
      	});
      	if (!this.state.currentSelect || !this.state.selected.panel) {
      		let checkId = panels.findIndex((el) => { return el.id === 0; });
      		if (checkId === -1) {
      			panelOptions.unshift(<option key="0" value={ message.pleaseChoose.id }>{ message.pleaseChoose.name }</option>);
      		}
      	}
      	let classAction = this.state.error.actionId !== false ? 'form-control borderWarning textAlignCenter' : 'form-control textAlignCenter';
		let classPanel = this.state.error.panelId !== false ? 'form-control borderWarning textAlignCenter' : 'form-control textAlignCenter';
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
					      		value={ this.state.selected.panel } 
					      	/>
					    </div>
					    <div class="col-xs-12 col-md-3">
							<input class={classPanel} type="text" disabled={this.props.disable} name="panelId" value={panelId} placeholder={message.labels.receipt} onChange={ this.setId.bind(this) } />
						</div>
						<div class="col-xs-12 col-md-3">
							<input class="form-control btn btn-primary cursorPointer" disabled={this.props.disable || this.state.disable.panel} type="button" value={message.orders.find} onClick={ this.setIdSearch.bind(this) } />
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
					      		value={ this.state.selected.action } 
					      	/>
					    </div>
					    <div class="col-xs-12 col-md-3">
							<input class={classAction} type="text" disabled={this.props.disable} name="actionId" value={actionId} placeholder={message.labels.receipt} onChange={ this.setId.bind(this) } />
						</div>
						<div class="col-xs-12 col-md-3">
							<input class="form-control btn btn-primary cursorPointer" disabled={this.props.disable || this.state.disable.action} type="button" value={message.orders.find} onClick={ this.setIdSearch.bind(this) } />
						</div>
					</div>
			    </div>
			</div>
    	)
	}
}