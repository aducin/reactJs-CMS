import React from 'react';
import axios from 'axios';

import Config from '../Config';

const url = Config.url;
const orderUrl = url.serverPath + url.pathOrder;

const OrderModel = {
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
