const state = {
  action: null,
  ajaxSent: false,
  ascending: false,
  createXml: false,
  display: false,
  errorHandler: false,
  innerFields: ['amount', 'amounts', 'automatic', 'list', 'maxAmount', 'message'],
  inProgress: false,
  link: undefined,
  modal: false,
  modalDisable: false,
  modalMessage: {
    text: null,
    type: null
  },
  modalObj: {},
  selected: {
    type: -1,
    state: -1,
    dateFrom: null,
    dateTo: null
  },
  modalObjError: {},
  selectedRow: null,
  sortBy: 'id'
}

export default state;