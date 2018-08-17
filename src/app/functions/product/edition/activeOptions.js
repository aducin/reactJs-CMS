export const activeOptions = (deletePhoto, productUpdated) => {
  let activeOptions = [];
  if (deletePhoto) {
    activeOptions.push(1);
  }
  if (productUpdated) {
    activeOptions.push(2);
  }
  return activeOptions;
};
