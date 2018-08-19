export const setHeight = (data) => {
  let bodyHeight = { minHeight: 540};
  let priceNew = parseFloat(data.price.new);
  let priceOld = parseFloat(data.price.old);
  if (data.discount.new || data.discount.old) {
    if (data.discount.new) {
      bodyHeight.minHeight += 54;
    }
    if (data.discount.old) {
      bodyHeight.minHeight += 54;
    }
    bodyHeight.minHeight += 27;
  }
  bodyHeight.minHeight = priceNew !== priceOld ? bodyHeight.minHeight + 27 : bodyHeight.minHeight;
  bodyHeight.minHeight = bodyHeight.minHeight + 'px';
  return bodyHeight;
};
