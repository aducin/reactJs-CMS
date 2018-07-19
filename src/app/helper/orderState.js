import Config from '../Config';

export const Header = {
  actionId: '',
  currentSelect: null,
  name: undefined,
  panelId: '',
  selected: {
    action: 0,
    panel: 0
  }
};

export const State = {
  checkDisabled: false,
  clear: false,
  currentVoucher: null,
  curShipment: Config.message.orders.defaultShipmentNumber,
  disable: false,
  display: false,
  empty: true,
  error: {
    actionId: false,
    panelId: false,
    value: null
  },
  header: Header,
  headerDisable: {
    action: true,
    panel: true
  },
  inProgress: false,
  panel: null,
  shipmentNumber: false,
  urlCheck: false
};

