import React from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import axios from 'axios';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/interval';

import Config from '../Config';
import { setUrl } from '../functions/setUrl';

const url = Config.url;
const productUrl = url.serverPath + url.pathProducts;

class ProductModel {
  checkModified = new Subject();
  lists = new Subject();
  modified = new Subject();
  orders = new Subject();
  newestOrdersInterval = Observable.interval(Config.intervalOrders);
  token;

  constructor() {}

  basicEdition (data, newAttr, oldAttr, config) {
    let path = Config.url.serverPath + 'products' + '/' + data.id + '/' + newAttr + '/' + oldAttr;
    return axios.put(path, {data}, config);
  }

  deleteModified(id) {
    let path = productUrl + '/modified/' + id;
    return axios.delete(path, {
      params: { token: this.token }
    });
  }

  deletePrinting(id) {
    let path = setUrl('pathProducts', 'printing');
    path +=  '/' + id + '/' + this.token;
    return axios.delete(path);
  }

  getCategories() {
    let path = url.serverPath + 'categories';
    return axios.get(path);
  }

  getManufactorer() {
    let path = url.serverPath + 'manufacturers';
    return axios.get(path);
  }

  getModified() {
    let path = setUrl('pathProducts', 'modified');
    return axios.get(path);
  }

  getPrintings() {
    let path = setUrl('pathProducts', 'printing', this.token);
    return axios.get(path);
  }

  modifyLastOrder(base, id) {
    let path = Config.url.serverPath + 'orders/last/' + base + '/' + id + '/' + this.token;
    return axios.get( path );
  }

  refreshModified() {
    this.checkModified.next();
  }

  saveFile(description, fd) {
    let path = setUrl('pathProducts', 'printing');
    path += '/' + this.token + '?description=' + description;
    return axios.post(path, fd);
  }

  saveProduct(newAttr, oldAttr, config, data) {
    let path = productUrl + '/' + data.id + '/' + newAttr + '/' + oldAttr;
    return axios.put(path, {data}, config);
  }

  setLists(data) {
    this.lists.next(data);
  }

  setToken(token) {
    this.token = token;
    Object.freeze(this);
  }
}

let instance = null;

const productModelInstance = () => {
  if (!instance) {
    instance = new ProductModel();
  }
  return instance;
}

export default productModelInstance;
