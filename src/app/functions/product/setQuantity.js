export const setQuantity = (quantity) => {
  let curQuantity;
  if (quantity.modified !== undefined) {
    curQuantity = quantity.modified;
  } else if (quantity.old !== undefined) {
    curQuantity = quantity.old;
  } else {
    curQuantity = quantity;
  }
  return curQuantity;
}
