import React from 'react';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import 'rxjs/add/observable/fromPromise';

import axios from 'axios';

import Config from '../Config';
import { appendTime } from '../functions/account/appendTime';
import { getAmounts } from '../functions/account/getAmounts';
import { getTaxes } from '../functions/account/getTaxes';
import { setUrl } from '../functions/setUrl';

let pathUrl = Config.url.serverPath + 'accounts';

export default class AccountModel {
  displayModalMessage = new Subject();
  list = new Subject();
  loading = new Subject();
  path;
  xml = new Subject();

  constructor() {}

  createXml(from, to, token) {
    this.path = Config.url.serverPath + 'jpk/' + token;
    let params = {
      dateFrom: from,
      dateTo: to
    };
    return axios.post(this.path, { params }, Config.ajaxConfig);
  }

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

  setXml(path) {
    this.xml.next(path);
  }
}
