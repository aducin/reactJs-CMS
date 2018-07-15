import React from 'react';

import { Observable } from 'rxjs/Observable';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import 'rxjs/add/observable/fromPromise';

import axios from 'axios';

import Config from '../Config.jsx';
import Helper from '../components/Helper.jsx';

let path;
let pathUrl = Config.url.serverPath + 'accounts';

const AccountModel = {
  createXml: (from, to, token) => {
    path = Config.url.serverPath + 'jpk/' + token;
    let params = {
      dateFrom: from,
      dateTo: to
    };
    return axios.get(path, { params });
  },
  getData: (params, token) => {
    path = pathUrl + '/' + token;
    let promise = axios.get(path, { params });
    return Observable.fromPromise(promise).map(response => {
      let finalObj = {...response};
      if (response.data.success) {
        finalObj.data.amounts = {};
        if (response.data.list) {
          let amount3 = 0;
          let amount17 = 0;
          response.data.list.forEach((el) => {
            el.floatAmount = parseFloat(el.amount);
            el.cashTimestamp = (new Date(el.cashTime)).getTime() / 1000;
            el.createTimestamp = (new Date(el.createTime)).getTime() / 1000;
            el.receiptTimestamp = (new Date(el.receiptTime)).getTime() / 1000;
            if (el.closed === 1) {
              if (el.type === 3) {
                amount17 += el.floatAmount;
              } else if (el.type !== 4){
                amount3 += el.floatAmount;
              } else {
                amount3 = amount3 - el.floatAmount;
              }
            }
          });
          finalObj.data.amounts.amount3 = amount3;
          finalObj.data.amounts.amount17 = amount17;
          finalObj.data.amounts.tax3 = amount3 * 0.03;
          finalObj.data.amounts.tax17 = amount17 * 0.17;
        }
        finalObj.data.dateFrom = response.data.dateFrom !== undefined ? response.data.dateFrom : null;
        finalObj.data.dateTo = response.data.dateTo !== undefined ? response.data.dateTo : null;
        finalObj.data.empty = Boolean(response.data.empty);
      } else {
        t shrow new Error(response.data.reason);
      }
      return finalObj;
    });
  },
  rowSave: (data) => {
    return axios.post(pathUrl, {data}, Config.ajaxConfig);
  },
  rowUpdate: (data) => {
    return axios.put(pathUrl, {data}, Config.ajaxConfig);
  }
}

export default AccountModel;