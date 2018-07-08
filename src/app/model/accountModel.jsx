import React from 'react';

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
    return axios.get(path, { params });
  },
  rowSave: (data) => {
    return axios.post(pathUrl, {data}, Config.ajaxConfig);
  },
  rowUpdate: (data) => {
    return axios.put(pathUrl, {data}, Config.ajaxConfig);
  }
}

export default AccountModel;