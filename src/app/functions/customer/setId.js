import Config from '../../Config';

export const setId = (customer) => {
  let id = [];
  if (customer && customer.old) {
    id.push(Config.message.customer.panels.old + ' - ID: ' + customer.old.id_customer);
  }
  if (customer && customer.new) {
    id.push(Config.message.customer.panels.new + ' - ID: ' + customer.new.id_customer);
  }
  return id;
};
