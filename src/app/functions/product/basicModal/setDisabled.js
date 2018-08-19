export const setDisabled = (state) => {
  return Boolean(state.errorFields.find(el => state.error[el]));
};
