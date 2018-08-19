export const setData = (state, props) => {
  let data = {};
  state.fields.forEach((el) => {
    if (state.doNotUpdateProps) {
      data[el] = state[el];
    } else {
      data[el] = props.data[el];
    }
  });
  return data;
};
