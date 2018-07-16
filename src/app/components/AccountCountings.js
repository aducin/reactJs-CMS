import React from 'react';

import Config from '../Config';

const getTime =  time => (new Date(time)).getTime() / 1000;
const typeReturn = 'return';
const typeTax17 = 'taxRate17';

const getType = (type) => {
  let index = Config.accountTypes.findIndex((el) => el.func === type);
  if (index !== -1) {
    return Config.accountTypes[index].id;
  }
  return false;
};

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

    if (el.closed === Config.accountStates[1].id) {
      let floatAmount = parseFloat(el.amount);
      let taxReturn = getType(typeReturn);
      let tax17 = getType(typeTax17);
      if (el.type === tax17) {
        amount17 += floatAmount;
      } else if (el.type !== taxReturn){
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
