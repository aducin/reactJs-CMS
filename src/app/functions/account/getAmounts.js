import Config from '../../Config';

const conditions = Config.accountConditions;

export const getAmounts = (list) => {
  let amount3 = 0;
  let amount17 = 0;
  list.forEach((el) => {
    el.floatAmount = parseFloat(el.amount);
    if (el.closed === conditions.CLOSED) {
      if (el.type === conditions.TAX17) {
        amount17 += el.floatAmount;
      } else if (el.type !== conditions.RETURN){
        amount3 += el.floatAmount;
      } else {
        amount3 -= el.floatAmount;
      }
    }
  });
  return { amount3, amount17 };
};

