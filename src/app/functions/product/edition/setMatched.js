export const setMatched = (modified, id) => {
  let matched = false;
  if (modified !== undefined && modified !== null && modified[0]) {
    modified.forEach(function(el) {
      if (parseInt(id) === parseInt(el.id)) {
        matched = true;
      }
    }, this);
  };
  return matched;
};
