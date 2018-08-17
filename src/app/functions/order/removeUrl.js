import Config from '../../Config';

export const removeUrl = (state, DefaultHeader) => {
  let curState = {...state};
  curState.clear = true;
  curState.curShipment = Config.message.orders.defaultShipmentNumber;
  curState.db = undefined;
  curState.disable = false;
  curState.header = DefaultHeader;
  curState.id = undefined;
  curState.shipmentNumber = false;
  return curState;
};
