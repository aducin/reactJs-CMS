import React from 'react';

import axios from 'axios';

import Config from '../Config';
import Helper from '../components/Helper.jsx';

let path;
let pathUrl = Config.url.serverPath + 'customer';

const CustomerModel = {
  getCustomerByEmail: (email, token) => {
    path = pathUrl + '/' + email + '/' + token;
    return axios.get( path );
  },
  getCustomerById: (db, id, token) => {
    path = pathUrl + '/' + db + '/' + id + '/vouchers/' + token;
    return axios.get( path );
  },
  sendCustomerEmail: (action, address, token) => {
    path = pathUrl + '/mail/' + token;
    let params = {
      email: address,
      result: action
    };
    return axios.get(path, { params });
  }
};

export default CustomerModel;