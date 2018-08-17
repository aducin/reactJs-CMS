export const setTags = (productTags) => {
  let tagString = '';
  if (Array.isArray(productTags)) {
    productTags.forEach((el) => {
      tagString = tagString + el.name + ', ';
    });
    if (tagString.length > 2) {
      tagString = tagString.slice(0, -2);
    }
  }
  return tagString;
};
