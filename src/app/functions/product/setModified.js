export const setModified = (currentModified, currentModifiedSearch) => {
  let modified, modifiedSearch;
  if(!currentModified) {
    modified = true;
    modifiedSearch = currentModifiedSearch;
  } else {
    modified = currentModified;
    modifiedSearch = false;
  }
  return [modified, modifiedSearch];
};

export const setModifiedData = (response) => {
  let data;
  if (response.status === 200 && response.data[0]) {
    data = { empty: false, list: response.data };
  } else if (response.status === 200 && !response.data[0]) {
    data = { empty: true, list: null };
  }
  return data;
};
