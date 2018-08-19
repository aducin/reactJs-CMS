export const checkWarning = (state, field, warning) => {
  return state.error[field] ? state[warning] : null;
};
