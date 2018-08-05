import Config from '../Config';

export const errorHandler = (modalObj) => {
  let error = Config.accountNumbers.filter((el) => modalObj[el] && isNaN(modalObj[el]));
  if (error) {
    return error.reduce((obj, key) => {
        obj[key] = true;
        return obj;
    }, {});
  } else {
    return {};
  }
}
