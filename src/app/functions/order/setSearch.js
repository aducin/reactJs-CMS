import Config from '../../Config';

const setSearch = (header) => {
  let id = header.currentSelect === 'action' ? header.actionId : header.panelId;
  let selectedId = header.currentSelect === 'action' ? header.selected.action : header.selected.panel;
  let actions = [...Config.orderActions];
  let panels = [...Config.orderPanels];
  let action;
  let idCheck = actions.concat(panels).findIndex((el) => { return parseInt(el.id) === parseInt(selectedId); });
  if (idCheck !== -1) {
    action = actions.concat(panels)[idCheck].action;
  }
  return { action, id, selectedId };
};

export default setSearch;
