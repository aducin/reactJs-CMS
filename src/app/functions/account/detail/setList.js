import Config from '../../../Config';

import { sortList } from '../../sort';

export const setList = (mainList, ascending, sortBy) => {
  let list = mainList.map((el) => {
    let curType = Config.accountTypes.filter((secondEl) => { return parseInt(secondEl.id) === parseInt(el.type); });
    if (curType[0]) {
      el.typeName = curType[0].name;
    }
    return el;
  });
  list = sortList([...list], sortBy);
  if (!ascending) {
    list.reverse();
  }
  return list;
};
