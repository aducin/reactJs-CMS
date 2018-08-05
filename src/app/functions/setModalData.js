import moment from 'moment';

export const setModalData = (action, originalList, selected) => {
  let list = [...originalList];
  let obj = {};
  if (action === 'modify') {
    let objCheck = list.findIndex((el) => { return parseInt(el.id) === parseInt(selected) });
    if (objCheck !== -1) {
      obj = list[objCheck];
      obj.cashDate = obj.cashTime ? moment(obj.cashTime) : null;
      obj.receiptDate = obj.receiptTime ? moment(obj.receiptTime) : null;
      obj.saveDisabled = true;
    }
  } else {
    obj = { closed: -1, type: -1 };
  }
  return obj;
}
