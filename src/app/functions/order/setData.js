import Config from '../../Config';

const setSelectData = (event, header) => {
  let name = event.target.name;
  let curSelected = { action: 0, panel: 0 };
  curSelected[name] = event.target.value;
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
  return data;
};

export default setSelectData;
