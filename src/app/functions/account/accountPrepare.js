import Config from '../../Config';

export const accountPrepare = (obj, token) => {
  let data = { ...obj.modalObj, token };
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let index = Config.accountNumbers.findIndex((el) => key === el);
      if (index !== -1 && !obj.modalObj[key]) {
        data[key] = 0;
      } else if (key === 'address' || key === 'remarks') {
        data[key] = obj.modalObj[key] ? obj.modalObj[key] : null;
      }
    }
  }
  return data;
}
