import Config from '../../../Config';

export const prepareOptions = (list) => {
  let noManufactorer = list.findIndex(el => { return el.id === 0 });
  let manufactorersList = [...list];
  if (noManufactorer) {
    manufactorersList.unshift(Config.message.otherManufactorer);
  }
  return manufactorersList;
};
