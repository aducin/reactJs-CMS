export const handleSelectChange = (e, props) => {
  let value = e.target.value;
  let name = e.target.name;
  let data = {...props, origin: 'select'};
  if (name === 'category') {
    data.activeCategory = value;
  } else if (name === 'manufactorer') {
    data.activeManufactorer = value;
  }
  return data;
};
