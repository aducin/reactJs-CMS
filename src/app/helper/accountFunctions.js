import Config from '../Config';
import moment from 'moment';

const conditions = Config.accountConditions;
const getTime =  time => (new Date(time)).getTime() / 1000;

export let appendTime = (list) => list.map((el) => ({
  ...el,
  cashTimestamp: getTime(el.cashTime),
  createTimestamp: getTime(el.createTime),
  receiptTimestamp: getTime(el.receiptTime)
}));

export let changeDate = (field, data, modalObj) => {
  let obj = {...modalObj};
  let momentVar = field + 'Date';
  let stringVar = field + 'Time';
  obj[momentVar] = data;
  obj[stringVar] = data.format("YYYY-MM-DD");
  return obj;
}

export const disableHandler = (state, error) => {
  if (Object.keys(error).length > 0) {
    return true;
  } else {
    let obj = state.modalObj;
    let disableCheck = Config.accountObligatory.find((el) => !obj[el] || obj[el] === -1 || obj[el] === undefined);
    let disabled = (state.modal === 'modify' && disableCheck === 'closed') ? false : Boolean(disableCheck);
    if ((!obj.cashDate || obj.cashDate === '') && (!obj.receiptDate || obj.receiptDate === '')) {
      disabled = true;
    }
    return disabled;
  }
}

export const errorHandler = (modalObj) => {
  let error = Config.accountNumbers.filter((el) => modalObj[el] && isNaN(modalObj[el]));
  if (error) {
    return error.reduce((obj, key) => {
      obj[key] = true;
      return obj;
    }, {});
  } else {
    return {};
  }
}

export const accountPrepare = (obj, token) => {
  let data = { ...obj, token };
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let index = Config.accountNumbers.findIndex((el) => key === el);
      if (index !== -1 && !obj[key]) {
        data[key] = 0;
      } else if (key === 'address' || key === 'remarks') {
        data[key] = this.state.modalObj[key] ? obj[key] : null;
      }
    }
  }
  return data;
}

export const formatDate = (date) => {
  return date.format('YYYY-MM-DD');
}

export const getAmounts = (list) => {
  let amount3 = 0;
  let amount17 = 0;
  list.forEach((el) => {
    el.floatAmount = parseFloat(el.amount);
    if (el.closed === conditions.CLOSED) {
      //let taxReturn = getType(typeReturn);
      //let tax17 = getType(typeTax17);
      if (el.type === conditions.TAX17) {
        amount17 += el.floatAmount;
      } else if (el.type !== conditions.RETURN){
        amount3 += el.floatAmount;
      } else {
        amount3 -= el.floatAmount;
      }
    }
  });
  return { amount3, amount17 };
};

export const getTaxes = (obj) => ({
  amount3: obj.amount3,
  amount17: obj.amount17,
  tax3: obj.amount3 * 0.03,
  tax17: obj.amount17 * 0.17,
});

export const handleFieldChange = (e, modal) => {
  let name = e.target.name;
  let value = e.target.value;
  if (name === 'amount') {
    value = value.replace(',', '.');
  }
  let obj = {...modal};
  obj[name] = value;
  return obj;
}

export const rowHandle = (id, list, model, selectedRow) => {
  let curSelected = null;
  let listCheck = list.findIndex((el) => { return el.id === id});
  if (selectedRow !== id && listCheck !== -1) {
    let closed = list[listCheck].closed;
    if (closed) {
      model.setMessage('error', Config.message.account.closed);
    } else {
      curSelected = id;
    }
  }
  return curSelected;
}

export const selectHandle = (e, selected) => {
  let name = e.target.name;
  let obj = {...selected};
  obj[name] = e.target.value;
  return obj;
}

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

export const setParams = (selected) => {
  let params = {};
  for (let el in selected) {
    if (selected[el] && selected[el] !== -1) {
      params[el] = selected[el] instanceof moment ? selected[el].format("YYYY-MM-DD") : selected[el];
    }
  }
  return params;
}
