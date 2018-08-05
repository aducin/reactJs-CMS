export const changeDate = (field, data, modalObj) => {
  let obj = {...modalObj};
  let momentVar = field + 'Date';
  let stringVar = field + 'Time';
  obj[momentVar] = data;
  obj[stringVar] = data.format("YYYY-MM-DD");
  return obj;
}
