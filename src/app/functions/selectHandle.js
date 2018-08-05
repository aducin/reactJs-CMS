export const selectHandle = (e, selected) => {
  let name = e.target.name;
  let obj = {...selected};
  obj[name] = e.target.value;
  return obj;
}
