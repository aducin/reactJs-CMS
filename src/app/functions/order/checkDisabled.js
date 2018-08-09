export const checkDisabled = (header, error) => {
  let curDisable = { action: true, panel: true };
  let name = header.name;
  let shortenName = name.replace('Id', '');
  let isNaNCheck = Boolean(isNaN(header[name]) || header[name] === '');
  if (header.selected[shortenName] !== 0 && !error[name] && !isNaNCheck) {
    curDisable[shortenName] = false;
  }
  return curDisable;
}