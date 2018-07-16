import React from 'react';

import { Observable } from 'rxjs/Observable';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import 'rxjs/add/observable/fromPromise';

import axios from 'axios';

import Config from '../Config.jsx';
import Helper from '../components/Helper.jsx';
import AccountCountings from '../components/AccountCountings.jsx';

let path;
let pathUrl = Config.url.serverPath + 'accounts';

const AccountModel = {
  createXml: (from, to, token) => {
    path = Config.url.serverPath + 'jpk/' + token;
    let params = {
      dateFrom: from,
      dateTo: to
    };
    return axios.post(path, { params }, Config.ajaxConfig);
  },
  getData: (params, token) => {
    path = pathUrl + '/' + token;
    let promise = axios.get(path, { params });
    return Observable.fromPromise(promise).map(response => {
      let finalObj = {...response};
      if (response.data.success) {
        if (response.data.list) {
          let amounts = AccountCountings.setAmounts(response.data.list);
          finalObj.data.amounts = AccountCountings.setTaxes(amounts);
          finalObj.data.list = AccountCountings.setList(response.data.list);
        }
      } else {
        throw new Error(response.data.reason);
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