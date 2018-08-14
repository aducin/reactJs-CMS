export const handleIdChange = (value, props) => {
  let data = {...props, origin: 'id'};
  let check = isNaN(value);
  let warning = {...props.warning};
  if (check || value === 0) {
    warning['id'] = true;
    data.warning = warning;
    data.searchDisabled = true;
  } else {
    let activeSearch = parseInt(value) < 1;
    warning['id'] = false;
    data.productId = value;
    data.productName = '';
    data.searchDisabled = activeSearch;
    data.warning = warning;
  }
  return data;
};
