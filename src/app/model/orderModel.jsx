import React from 'react';

import axios from 'axios';

import Config from '../Config.jsx';
import Helper from '../components/Helper.jsx';

const url = Config.url;
const orderUrl = url.serverPath + url.pathOrder;

const OrderModel = {
  evenData: (db, id) => {
    let path = orderUrl + '/' + db + '/' + id + '/even';
    return axios.put(path, {}, Config.ajaxConfig);
  },
  getData: (db, id, token) => {
    let path = orderUrl + '/' + db + '/' + id + '/' + token;
    return axios.get(path);
  },
  getDiscountOrMail: (action, db, id, token) => {
    let path = orderUrl + '/' + db + '/' + id + '/' + token + '?action=' + action;
    return axios.get(path);
  },
  getVoucher: (db, id) => {
    let path = orderUrl + '/' + db + '/' + id;
    let params = { basic: true };
    return axios.get(path, { params })
  },
  sendEmail: (action, db, id, token) => {
    let path = orderUrl + '/' + db + '/' + id + '/mail/' + token;
    let params = {
      action: action,
      result: 'send'
    };
    if (action === 'voucher') {
      params.action = 'voucher';
      params.voucherNumber = number;
    } else if (action === 'deliveryNumber') {
      params.deliveryNumber = number;
    } else if (action === 'mail') {
      params.action = 'undelivered';
    }
    return axios.get(path, { params });
  }
}

export default OrderModel;
