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

export let getAmounts = (list) => {
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

export let getTaxes = (obj) => ({
  amount3: obj.amount3,
  amount17: obj.amount17,
  tax3: obj.amount3 * 0.03,
  tax17: obj.amount17 * 0.17,
});

export let setModalData = (action, originalList, selected) => {
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
