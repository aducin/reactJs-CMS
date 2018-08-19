export const prepareSaveData = (state, token) => {
  let quantity = state.quantity.old;
  let data = { db: 'both', id: state.id, name: state.name, quantity, token: token };
  if (!state.discount.new && !state.discount.old) {
    data.price = state.price.old;
  }
  return data;
};
