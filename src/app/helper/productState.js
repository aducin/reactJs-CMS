import Config from '../Config';

export const State = {
  action: null,
  category: 0,
  categoryDisplay: false,
  cleared: false,
  componentChecked: false,
  constant: false,
  currentId: {
    full: null,
    simple: null
  },
  disable: true,
  disabledEdition: false,
  editionSearched: false,
  error: false,
  file: null,
  header: {
    activeCategory: 0,
    activeManufactorer: 0,
    origin: null,
    productId: 0,
    productName: '',
    productLabel: Config.message.labels.productName,
    searchDisabled: true,
    title: Config.message.title.products,
    warning: {
      id: false,
      name: false
    }
  },
  historySearched: false,
  imageDisplay: false,
  manufactorer: 0,
  modified: false,
  modifiedSearch: false,
  nameSearch: false,
  nameSearchData: {},
  printingSearch: false,
  promise: null,
  restoreList: false,
  saveData: {},
  searching: false,
  simpleSearched: false,
  success: false,
  toDisplay: undefined,
  warning: false
};