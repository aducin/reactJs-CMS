export const getTaxes = (obj) => ({
  amount3: obj.amount3,
  amount17: obj.amount17,
  tax3: obj.amount3 * 0.03,
  tax17: obj.amount17 * 0.17,
});

