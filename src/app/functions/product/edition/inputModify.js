export const inputModify = (state, data) => {
  let curState = {...state};
  let origin = data.target.name;
  let value = data.target.value;
  if (origin !== 'priceNew' && origin !== 'priceOld' && origin !== 'quantity') {
    curState[origin] = value;
  } else if (origin === 'quantity') {
    curState.quantity.modified = parseInt(value);
  } else {
    let curPrice = {...state.price};
    if (origin === 'priceNew') {
      curPrice.new = value;
    } else if (origin === 'priceOld') {
      curPrice.old = value;
    }
    curState.price = curPrice;
  }
  return curState;
};
