import Config from '../../Config';

export const disableHandler = (state, error) => {
  if (Object.keys(error).length > 0) {
    return true;
  } else {
    let obj = state.modalObj;
    let disableCheck = Config.accountObligatory.find((el) => !obj[el] || obj[el] === -1 || obj[el] === undefined);
    let disabled = (state.modal === 'modify' && disableCheck === 'closed') ? false : Boolean(disableCheck);
    if ((!obj.cashDate || obj.cashDate === '') && (!obj.receiptDate || obj.receiptDate === '')) {
      disabled = true;
    }
    return disabled;
  }
}
