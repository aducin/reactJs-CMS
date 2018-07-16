import Config from '../Config';
import moment from 'moment';

const conditions = Config.accountConditions;
const getTime =  time => (new Date(time)).getTime() / 1000;
//const typeReturn = 'return';
//const typeTax17 = 'taxRate17';

/*
const getType = (type) => {
  let index = Config.accountTypes.findIndex((el) => el.func === type);
  if (index !== -1) {
    return Config.accountTypes[index].id;
  }
  return false;
};
*/

export let appendTime = (list) => list.map((el) => ({
  ...el,
  cashTimestamp: getTime(el.cashTime),
  createTimestamp: getTime(el.createTime),
  receiptTimestamp: getTime(el.receiptTime)
}));

export let getAmounts = (list) => {
  let amount3 = 0;
  let amount17 = 0;
  list.forEach((el) => {
    if (el.closed === conditions.CLOSED) {
      let floatAmount = parseFloat(el.amount);
      //let taxReturn = getType(typeReturn);
      //let tax17 = getType(typeTax17);
      if (el.type === conditions.TAX17) {
        amount17 += floatAmount;
      } else if (el.type !== conditions.RETURN){
        amount3 += floatAmount;
      } else {
        amount3 -= floatAmount;
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
