import moment from 'moment';

export const setParams = (selected) => {
  let params = {};
  for (let el in selected) {
    if (selected[el] && selected[el] !== -1) {
      params[el] = selected[el] instanceof moment ? selected[el].format("YYYY-MM-DD") : selected[el];
    }
  }
  return params;
}
