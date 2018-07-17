import Config from '../Config';

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
    panelId: false
  },
  header: {
    actionId: '',
    currentSelect: null,
    name: undefined,
    panelId: '',
    selected: {
      action: 0,
      panel: 0
    },
  },
  headerDisable: false,
  inProgress: false,
  panel: null,
  promise: null,
  shipmentNumber: false,
  urlCheck: false
};
