export const setEqualState = (props) => {
  let data = {};
  data.id = props.id;
  data.discount = props.discount;
  data.name = props.name;
  data.quantity = props.quantity;
  data.price = {...props.price};
  data.showModal = true;
  return data;
};
