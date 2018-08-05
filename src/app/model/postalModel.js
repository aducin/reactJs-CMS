import React from 'react';

import axios from 'axios';

import Config from '../Config';
import Helper from '../helper/Helper.jsx';
import { setUrl } from '../functions/setUrl';

let path;

const PostalModel = {
  getData: (token) => {
    path = setUrl('pathPostal', token);
    return axios.get(path);
  },
  setData: (amount, modal) => {
    path = Config.url.serverPath + 'postal';
    let data = {
      action: modal,
      amount: amount
    };
    return axios.put(path, {data}, Config.ajaxConfig);
  }
}

export default PostalModel;