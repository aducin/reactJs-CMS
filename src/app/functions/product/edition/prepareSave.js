import { setQuantity } from '../setQuantity';

export const prepareSave = (state) => {
  let curState = {...state};
  let data = state.fields.reduce((obj, key) => {
    obj[key] = curState[key];
    return obj;
  }, {});
  if (typeof(data.productTags) === 'object') {
    let tags = data.productTags.map(el => el.name);
    data.productTags = tags.join(', ');
  }
  data.action = 'full';
  data.quantity = setQuantity(data.quantity);
  return data;
};
