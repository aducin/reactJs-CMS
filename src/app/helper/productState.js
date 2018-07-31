import Config from '../Config';

export const Header = {
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
};

export const State = {
  action: null,
  category: 0,
  categoryDisplay: false,
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
  header: Header,
  historySearched: false,
  imageDisplay: false,
  manufactorer: 0,
  modified: false,
  modifiedSearch: false,
  nameSearch: false,
  nameSearchData: {},
  printingSearch: false,
  restoreList: false,
  saveData: {},
  searching: false,
  simpleSearched: false,
  success: false,
  toDisplay: undefined,
  warning: false
};