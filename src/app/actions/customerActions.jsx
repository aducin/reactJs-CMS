export function clearData(data) {
  return {
    type: 'clear_data',
    payload: null,
  }
}

export function setData(dataObj) {
  return {
    type: 'set_data',
    payload: dataObj,
  }
}