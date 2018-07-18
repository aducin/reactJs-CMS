import React from 'react';

import axios from 'axios';

import Config from '../Config';
import { setUrl } from '../helper/functions';

const url = Config.url;
const orderUrl = url.serverPath + url.pathProducts;

const ProductModel = {
  getModyfied: () => {
    let path = setUrl('pathProducts', 'modified');
    return axios.get(path);
  },
  getPrintings: (token) => {
    let path = setUrl('pathProducts', 'printing', token);
    return axios.get(path);
  }
}

export default ProductModel;