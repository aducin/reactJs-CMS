export const sortList = (list, field) => {
  const sortFn = (a, b) => {
    if (a[field] === null) {
      return -1;
    } else {
      if (typeof(a[field]) === 'string') {
        var nameA = a[field].toLowerCase().localeCompare(b[field].toLowerCase(), "pl-PL");
        var nameB = b[field].toLowerCase().localeCompare(a[field].toLowerCase(), "pl-PL");
        if (nameA < nameB)
          return -1
        if (nameA > nameB)
          return 1
        return 0;
      } else if (typeof(a[field]) === 'number') {
        return a[field] - b[field];
      }
    }
  };
  return list.sort(sortFn);
};
