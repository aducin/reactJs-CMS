import { setMatched } from './setMatched';

import Config from '../../../Config';

export const checkBoxOptions = (modified, id) => {
  let options = [{id: 1, name: Config.message.additional.deletePhotos, value: 'photo'}];
  if (!setMatched(modified, id)) {
    options.push({id: 2, name: Config.message.additional.modify, value: 'productChanged'});
  }
  return options;
};
