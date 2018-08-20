export const sortList = (list, field) => {
  const sortFn = (a, b) => {
    if (a[field] === null) {
      return -1;
    } else {
      if (typeof(a[field]) === 'string') {
        if (b[field] === null) {
          b[field] = '';
        }
        let nameA = a[field].toLowerCase().localeCompare(b[field].toLowerCase(), "pl-PL");
        let nameB = b[field].toLowerCase().localeCompare(a[field].toLowerCase(), "pl-PL");
        if (nameA < nameB)
          return -1;
        if (nameA > nameB)
          return 1;
        return 0;
      } else if (typeof(a[field]) === 'number') {
        a[field] = !isNaN(a[field]) ? a[field] : 0;
        b[field] = !isNaN(b[field]) ? b[field] : 0;
        return a[field] - b[field];
      }
    }
  };
  return list.sort(sortFn);
};
