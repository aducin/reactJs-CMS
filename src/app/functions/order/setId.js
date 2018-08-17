import Config from '../../Config';

const setCurrentId = (event, header, error) => {
  let name = event.target.name;
  let value = event.target.value;
  let curAction = name === 'actionId' ? header.selected.action : 0;
  let curPanel = name === 'panelId' ? header.selected.panel : 0;
  let selected = { action: curAction, panel: curPanel };
  let curError = {...error};
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
  return data;
};

export default setCurrentId;
