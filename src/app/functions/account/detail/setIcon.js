import Config from '../../../Config';

import { sortList } from '../../sort';

export const setIcon = (value, field, ascending) => {
  let icon;
  if (value !== field) {
    icon = 'fa fa-sort';
  } else {
    if (ascending) {
      icon = 'fa fa-sort-desc';
    } else {
      icon = 'fa fa-sort-asc';
    }
  }
  return icon;
};
