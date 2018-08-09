import OrderModel from '../model/orderModel.js';

export default class Email {
  constructor(mainModel) {
    this.mainModel = mainModel;
  }

  send(params, token) {
    let action = params.action ? params.action : 'deliveryNumber';
    OrderModel.sendEmail(action, params.db, params.id, token)
      .then((response) => {
      if (response.data.success) {
      this.mainModel.setMessage('success', response.data.reason);
    } else {
      throw new Error(response.data.reason);
    }
  })
  .catch((err) => this.mainModel.setMessage('warning', err.message) );
  }
}
