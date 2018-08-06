export const rowHandle = (id, list, model, selectedRow) => {
  let curSelected = null;
  let listCheck = list.findIndex((el) => { return el.id === id});
  if (selectedRow !== id && listCheck !== -1) {
    let closed = list[listCheck].closed;
    if (closed) {
      model.setMessage('error', Config.message.account.closed);
    } else {
      curSelected = id;
    }
  }
  return curSelected;
}
