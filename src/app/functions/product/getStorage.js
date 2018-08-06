import { reactLocalStorage } from 'reactjs-localstorage';

export const getStorage = () => {
  return {
    category: reactLocalStorage.get('categorySearch'),
    manufactorer: reactLocalStorage.get('manufactorerSearch'),
    search: reactLocalStorage.get('nameSearch')
  }
}
