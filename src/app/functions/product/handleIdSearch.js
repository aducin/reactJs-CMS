export const handleIdSearch = (data) => {
  let value = data.productId;
  let check = isNaN(value);
  let curData = {...data, origin: 'idSearch'};
  if (check || value === 0) {
    curData.searchDisabled = true;
  } else {
    curData.productName = '';
  }
  return curData;
};
