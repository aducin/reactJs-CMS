import { reactLocalStorage } from 'reactjs-localstorage';

export const setStorage = (data) => {
  reactLocalStorage.set('categorySearch', data.category);
  reactLocalStorage.set('manufactorerSearch', data.manufactorer);
  reactLocalStorage.set('nameSearch', data.search);
}

export const setStorageConstant = (response) => {
  reactLocalStorage.setObject('constant', { category: response[0].data, manufactorer: response[1].data });
}

export const setStorageSimple = (id) => {
  reactLocalStorage.set('searchId', parseInt(id));
}
