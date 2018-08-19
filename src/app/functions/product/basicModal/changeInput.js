export const changeInput = (e, state) => {
  let name = e.target.name;
  let value = e.target.value;
  let curError = {...state.error};
  let result;
  if (name === 'name') {
    curError.name = value.length < 3;
    result = { error: curError, name: value, setDisabledSave: true };
  } else if (name === 'amount') {
    let intCheck = isNaN(value) || value.length === 0;
    curError.quantity = intCheck;
    let curQuantity = Boolean(intCheck) ? state.quantity : { new: parseInt(value), old: parseInt(value) };
    result = { error: curError, quantity: curQuantity, setDisabledSave: true };
  } else if (name === 'price') {
    let priceCheck = isNaN(value.replace(',', '.')) || value.length === 0;
    curError.price = priceCheck;
    let curPrice = Boolean(priceCheck) ? state.price : { new: value, old: value };
    result = { error: curError, price: curPrice, setDisabledSave: true };
  }
  return result;
};
