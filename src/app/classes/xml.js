import { formatDate } from '../functions/formatDate';

export default class Xml {
  constructor(model, mainModel) {
    this.mainModel = mainModel;
    this.model = model;
  }

  create(selected, token) {
    if (selected.dateFrom !== null && selected.dateTo !== null) {
      this.model.createXml(formatDate(selected.dateFrom), formatDate(selected.dateTo), token)
        .then((response) => {
        if (response.data.success) {
          this.mainModel.setMessage('success', response.data.reason);
          this.model.setXml(response.data.path);
        } else {
          throw new Error(response.data.reason);
        }
      })
      .catch((err) => this.mainModel.setMessage('warning', err.message));
      }
  }
}
