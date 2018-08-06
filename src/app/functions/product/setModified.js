export const setModified = (currentModified) => {
  let modified, modifiedSearch;
  if(!currentModified) {
    modified = true;
    modifiedSearch = true;
  } else {
    modified = currentModified;
    modifiedSearch = false;
  }
  return [modified, modifiedSearch];
}