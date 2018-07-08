import React from 'react';

import axios from 'axios';

import Config from '../Config.jsx';
import Helper from '../components/Helper.jsx';

let path;

const PostalModel = {
  getData: (token) => {
    path = Helper.setUrl('pathPostal', token);
    return axios.get(path);
  },
  setData: (amount, modal, config) => {
    path = Config.url.serverPath + 'postal';
    let data = {
      action: modal,
      amount: amount
    };
    return axios.put(path, {data}, config);
  }
}

export default PostalModel;