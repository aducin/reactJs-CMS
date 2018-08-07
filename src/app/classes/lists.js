import { getCachedLists } from '../functions/product/getCachedLists';
import { getPromises } from '../functions/product/getPromises';

export default class Lists {
  constructor(model, mainModel) {
    this.mainModel = mainModel;
    this.model = model;
  }

  getLists() {
    let cachedLists = getCachedLists();
    if (cachedLists.success) {
      this.model.setLists(cachedLists);
    } else {
      getPromises()
        .then(response => {
        if (response[0].status === 200 && response[1].status === 200) {
        setStorageConstant(response);
        this.model.setLists({ category: response[0].data, manufactorer: response[1].data });
      } else {
        throw new Error(response[0].data.reason);
      }
    })
    .catch((err) => this.props.mainModel.setMessage('warning', err.message));
    }
  }
}