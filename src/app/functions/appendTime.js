const getTime =  time => (new Date(time)).getTime() / 1000;

export const appendTime = (list) => list.map((el) => ({
  ...el,
  cashTimestamp: getTime(el.cashTime),
  createTimestamp: getTime(el.createTime),
  receiptTimestamp: getTime(el.receiptTime)
}));
