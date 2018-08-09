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

export default class ProductModel {
  checkModified = new Subject();
  lists = new Subject();
  orders = new Subject();
  newestOrdersInterval = Observable.interval(Config.intervalOrders);

  constructor() {}

  basicEdition (data, newAttr, oldAttr, config) {
    let path = Config.url.serverPath + 'products' + '/' + data.id + '/' + newAttr + '/' + oldAttr;
    return axios.put(path, {data}, config);
  }

  deleteModified(id, token) {
    let path = productUrl + '/modified/' + id;
    return axios.delete(path, {
      params: { token: token }
    });
  }

  deletePrinting(id, token) {
    let path = setUrl('pathProducts', 'printing');
    path +=  '/' + id + '/' + token;
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

  getPrintings(token) {
    let path = setUrl('pathProducts', 'printing', token);
    return axios.get(path);
  }

  modifyLastOrder(base, id, token) {
    let path = Config.url.serverPath + 'orders/last/' + base + '/' + id + '/' + token;
    return axios.get( path );
  }

  refreshModified() {
    this.checkModified.next();
  }

  refreshOrders() {
    this.orders.next();
  }

  saveFile(description, fd, token) {
    let path = setUrl('pathProducts', 'printing');
    path += '/' + token + '?description=' + description;
    return axios.post(path, fd);
  }

  saveProduct(newAttr, oldAttr, config, data) {
    let path = productUrl + '/' + data.id + '/' + newAttr + '/' + oldAttr;
    return axios.put(path, {data}, config);
    //this.productSave.next(result);
  }

  setLists(data) {
    this.lists.next(data);
  }
}
