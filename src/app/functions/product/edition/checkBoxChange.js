export const checkBoxChange = (state, list, origin) => {
  let curState = {...state};
  if (origin !== 'checkboxOptions') {
    curState.productCategories = list;
  } else {
    curState.deletePhoto = list.indexOf(1) !== -1;
    curState.productUpdated = list.indexOf(2) !== -1;
  }
  return curState;
};
