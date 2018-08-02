import { reactLocalStorage } from 'reactjs-localstorage';

import ProductModel from '../model/productModel';
import Config from '../Config';

export default class ProductHelper {

  constructor() {
    this.model = new ProductModel;
  }

  checkIfModified(params, state) {
    let edition = params.action === 'edition' && state.editionSearched !== params.id;
    let history = params.action === 'history' && state.historySearched !== params.id;
    if (edition || history) {
      let action = params.action === 'edition' ? 'searchEdition' : 'searchHistory';
      let editionSearched = edition ? params.id : false;
      let historySearched = history ? params.id : false;
      return {action, edition, editionSearched, history, historySearched};
    } else {
      return false;
    }
  }

  clearStorage() {
    reactLocalStorage.set('categorySearch', null);
    reactLocalStorage.set('manufactorerSearch', null);
    reactLocalStorage.set('nameSearch', null);
  }

  getCachedLists() {
    let cached = reactLocalStorage.getObject('constant');
    if (cached !== undefined && cached.category !== undefined && cached.manufactorer !== undefined) {
      return {
        success: true,
        category: cached.category,
        manufactorer: cached.manufactorer
      };
    } else {
      return { success: false };
    }
  }

  getPromises() {
    const category = this.model.getCategories();
    const manufactorer = this.model.getManufactorer();
    reactLocalStorage.setObject('constant', {'category': category, 'manufactorer': manufactorer});
    return Promise.all([category, manufactorer]);
  }

  getStorage() {
    return {
      category: reactLocalStorage.get('categorySearch'),
      manufactorer: reactLocalStorage.get('manufactorerSearch'),
      search: reactLocalStorage.get('nameSearch')
    }
  }

  setQuantity(quantity) {
    let curQuantity;
    if (quantity.modified !== undefined) {
      curQuantity = quantity.modified;
    } else if (quantity.old !== undefined) {
      curQuantity = quantity.old;
    } else {
      curQuantity = quantity;
    }
    return curQuantity;
  }

  setStorage(data) {
    reactLocalStorage.set('categorySearch', data.category);
    reactLocalStorage.set('manufactorerSearch', data.manufactorer);
    reactLocalStorage.set('nameSearch', data.search);
  }

  setStorageConstant(response) {
    reactLocalStorage.setObject('constant', { category: response[0].data, manufactorer: response[1].data });
  }

  setStorageSimple(id) {
    reactLocalStorage.set('searchId', parseInt(id));
  }
}