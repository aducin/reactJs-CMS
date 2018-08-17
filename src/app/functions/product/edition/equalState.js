export const equalState = (state, product) => {
  let curState = {...state};
  state.fields.forEach((el) => {
    if (el !== 'deletePhoto' && el !== 'productUpdated') {
      curState[el] = product[el];
    } else {
      curState[el] = false;
    }
  });
  return curState;
};
