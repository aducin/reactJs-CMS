import Config from '../Config';

export const Basic = {
  borderWarning: 'borderWarning',
  classWarning: 'colorWarning',
  doNotUpdateProps: false,
  disabled: false,
  disabledSave: true,
  discount: {},
  error: {},
  errorFields: ['name', 'quantity', 'price'],
  fields: ['id', 'name', 'quantity', 'price', 'discount'],
  id :null,
  message: undefined,
  messageType: undefined,
  name: null,
  price: {},
  quantity: {},
  save: false,
  setDisabledSave: false,
  setTimeout: false,
  showModal: false
};

export const Edition = {
  id: false,
  activatedFull: false,
  activatedSimple: false,
  categoryDisplay: false,
  deletePhoto: false,
  emptyObj: {id: null, name: 'Nie wybrano'},
  fields: ['active', 'condition', 'deletePhoto', 'description', 'descriptionShort', 'id', 'linkRewrite', 'manufactorer', 'metaDescription',
    'metaTitle', 'name', 'price', 'productCategories', 'productTags', 'productUpdated', 'quantity'],
  imageDisplay: false,
  productUpdated: false
}

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

export const PrintingState = {
  data: null,
  description: '',
  disabled: false,
  file: null,
  inSearch: false,
  messageContent: null,
  messageType: null,
  modal: false,
  saveDisable: true,
  saveFile: false,
  setTimeout: false
};

export const State = {
  action: null,
  category: 0,
  categoryDisplay: false,
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
  getList: 0,
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
  //componentSearched: false,
  searching: false,
  simpleSearched: false,
  success: false,
  toDisplay: undefined,
  token: null,
  warning: false
};