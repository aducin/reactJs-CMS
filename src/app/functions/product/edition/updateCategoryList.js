export const updateCategoryList = (categoryList) => {
  if (Array.isArray(categoryList)) {
    let list = [...categoryList];
    categoryList = list.map((el) => {
      el.name = el.metaTitle;
      return el;
    });
  }
  return categoryList;
};
