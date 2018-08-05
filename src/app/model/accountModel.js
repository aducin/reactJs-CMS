import React from 'react';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import 'rxjs/add/observable/fromPromise';

import axios from 'axios';

import Config from '../Config';
import { appendTime } from '../functions/appendTime';
import { getAmounts } from '../functions/getAmounts';
import { getTaxes } from '../functions/getTaxes';
import { setUrl } from '../functions/setUrl';

let pathUrl = Config.url.serverPath + 'accounts';

export default class AccountModel {
  displayModalMessage = new Subject();
  list = new Subject();
  loading = new Subject();
  path;

  constructor() {}

  createXml(from, to, token) {
    this.path = Config.url.serverPath + 'jpk/' + token;
    let params = {
      dateFrom: from,
      dateTo: to
    };
    return axios.post(this.path, { params }, Config.ajaxConfig);
  }
/*
  getData(params, token) {
    this.loading.next(true);
    this.path = pathUrl + '/' + token;
    let promise = axios.get(this.path, { params });
    let result = Observable.fromPromise(promise).map(response => {
      let finalObj = {...response};
      if (response.data.success) {
        if (response.data.list) {
          let amounts = getAmounts(response.data.list);
          finalObj.data.amounts = getTaxes(amounts);
          finalObj.data.list = appendTime(response.data.list);
        }
      } else {
        throw new Error(response.data.reason);
      }
      return finalObj;
    });
    this.list.next(result);
    this.loading.next(false);
  }
*/
  rowSave(data) {
    return axios.post(pathUrl, {data}, Config.ajaxConfig);
  }

  rowUpdate(data) {
    return axios.put(pathUrl, {data}, Config.ajaxConfig);
  }

  setMessage() {
    this.displayModalMessage.next(true);
    setTimeout(function() {
      this.displayModalMessage.next(false);
    }.bind(this), Config.timer);
  }
}
