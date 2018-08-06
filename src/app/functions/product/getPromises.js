import ProductModel from '../../model/productModel';

export const getPromises = () => {
  const category = ProductModel.getCategories();
  const manufactorer = ProductModel.getManufactorer();
  reactLocalStorage.setObject('constant', {'category': category, 'manufactorer': manufactorer});
  return Promise.all([category, manufactorer]);
}
