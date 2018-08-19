export const setMessageStyle = (state) => {
  let messageStyle;
  if (state.success) {
    messageStyle = "alert alert-success";
  } else if (state.failure) {
    messageStyle = "alert alert-danger";
  }
  return messageStyle;
};
