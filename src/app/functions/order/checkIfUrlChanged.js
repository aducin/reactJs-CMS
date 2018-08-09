export const checkIfUrlChanged = (params, curParams, order, inProgress) => {
  let changed = false;
  let newParams = params.db !== curParams.db || params.id !== curParams.id;
  let newAction = params.action !== curParams.action;
  let noData = !order.orderData && !order.additionalData;
  let paramsAvailable = params.db !== undefined && params.id !== undefined;
  if ((newParams || newAction) && paramsAvailable) {
    changed = true;
  }
  if (noData && paramsAvailable && !order.loading && !inProgress) {
    changed = true;
  }
  return changed;
}