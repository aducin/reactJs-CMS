import React from 'react';

import Config from '../Config.jsx';

const AccountCountings = {
  setAmounts: (list) => {
    let amount3 = 0;
    let amount17 = 0;
    list.forEach((el) => {
      if (el.closed === Config.accountStates[1].id) {
        el.floatAmount = parseFloat(el.amount);
        if (el.type === Config.accountTypes[2].id) {
          amount17 += el.floatAmount;
        } else if (el.type !== Config.accountTypes[3].id){
          amount3 += el.floatAmount;
        } else {
          amount3 = amount3 - el.floatAmount;
        }
      }
    });
    return {
      amount3: amount3,
      amount17: amount17
    };
  },
  setList: (list) => {
    list.map((el) => {
      el.cashTimestamp = (new Date(el.cashTime)).getTime() / 1000;
      el.createTimestamp = (new Date(el.createTime)).getTime() / 1000;
      el.receiptTimestamp = (new Date(el.receiptTime)).getTime() / 1000;
      return el;
    });
    return list;
  },
  setTaxes: (obj) => {
    let taxes = {};
    taxes.amount3 = obj.amount3;
    taxes.amount17 = obj.amount17;
    taxes.tax3 = obj.amount3 * 0.03;
    taxes.tax17 = obj.amount17 * 0.17;
    return taxes;
  }
};

export default AccountCountings;