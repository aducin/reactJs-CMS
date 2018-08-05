export const createReducedObj = (src, keys) => keys.reduce((obj, key) => {
  obj[key] = src[key];
return obj;
}, {});
