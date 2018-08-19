export const handleFieldChange = (e, modal) => {
  let name = e.target.name;
  let value = e.target.value;
  if (name === 'amount') {
    value = value.replace(',', '.');
  }
  let obj = {...modal};
  obj[name] = value;
  return obj;
};
