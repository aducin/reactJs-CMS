export const selectHandle = (e, selected) =>
  ({...selected, [e.target.name]: e.target.value});
