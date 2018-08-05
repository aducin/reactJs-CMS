export const validateNumber = (data) => {
  let value = data.replace(',', '.');
  return isNaN(value);
}
