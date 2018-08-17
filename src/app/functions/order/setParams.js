export const setParams = (nextProps, state) => {
  let result = { update: false };
  let params = nextProps.params;
  let modified = params.id !== state.params.id || params.db !== state.params.db || params.action !== state.params.action;
  if (modified) {
    result.update = true;
    result.params = {
      id: params.id,
      db: params.db,
      action: params.action
    };
  }
  return result;
};
