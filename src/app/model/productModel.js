import React from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import axios from 'axios';

import Config from '../Config';
import { setUrl } from '../helper/functions';

const url = Config.url;
const productUrl = url.serverPath + url.pathProducts;

const ProductModel = {
  basicEdition: (data, newAttr, oldAttr, config) => {
    let path = Config.url.serverPath + 'products' + '/' + data.id + '/' + newAttr + '/' + oldAttr;
    return axios.put(path, {data}, config);
  },
  deleteModified: (id, token) => {
    let path = productUrl + '/modified/' + id;
    return axios.delete(url, {
      params: { token: token }
    });
  },
  deletePrinting: (id, token) => {
    let path = setUrl('pathProducts', 'printing');
    path +=  '/' + id + '/' + token;
    return axios.delete(path);
  },
  getCategories: () => {
    let path = url.serverPath + 'categories';
    return axios.get(path);
  },
  getManufactorer: () => {
    let path = url.serverPath + 'manufacturers';
    return axios.get(path);
  },
  getModyfied: () => {
    let path = setUrl('pathProducts', 'modified');
    return axios.get(path);
  },
  getPrintings: (token) => {
    let path = setUrl('pathProducts', 'printing', token);
    return axios.get(path);
  },
  modifyLastOrder: (base, id, token) => {
    let path = Config.url.serverPath + 'orders/last/' + base + '/' + id + '/' + token;
    return axios.get( path );
  },
  nameSearch: (data) => {
    return axios.get( productUrl, {params: data} );
  },
  saveFile: (description, fd, token) => {
    let path = setUrl('pathProducts', 'printing');
    path += '/' + token + '?description=' + description;
    return axios.post(path, fd);
  },
  saveProduct: (newAttr, oldAttr, config, data) => {
    let path = productUrl + '/' + data.id + '/' + newAttr + '/' + oldAttr;
    return axios.put(path, {data}, config);
  },
  searchId: (editionSearched, simpleSearched) => {
    let url = productUrl + '/';
    let curNumber;
    if (editionSearched) {
      url += editionSearched;
      curNumber = editionSearched;
    } else if (simpleSearched) {
      url += simpleSearched + '?basic=true';
      curNumber = simpleSearched;
    }
    reactLocalStorage.set('searchId', curNumber);
    return axios.get(url, {});
  },
  searchHistory: (historySearched) => {
    let path = productUrl + '/' + historySearched + '/history';
    return axios.get(path);
  }
}

export default ProductModel;