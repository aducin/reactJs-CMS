export const getPromises = (ProductModel) => {
  const category = ProductModel.getCategories();
  const manufactorer = ProductModel.getManufactorer();
  //reactLocalStorage.setObject('constant', {'category': category, 'manufactorer': manufactorer});
  return Promise.all([category, manufactorer]);
}
