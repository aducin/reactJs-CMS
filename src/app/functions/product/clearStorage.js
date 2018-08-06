import { reactLocalStorage } from 'reactjs-localstorage';

export const clearStorage = () => {
  reactLocalStorage.set('categorySearch', null);
  reactLocalStorage.set('manufactorerSearch', null);
  reactLocalStorage.set('nameSearch', null);
}
