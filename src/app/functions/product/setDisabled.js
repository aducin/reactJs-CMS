export const setDisabled = (props, state) => {
  let disabled = !state.constant || (props.params.action !== undefined && props.params.id !== undefined);
  if (disabled !== state.disable) {
    return { disable: disabled };
  }
  return null;
};
