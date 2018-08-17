export const selectChange = (state, e) => {
  let curState = {...state};
  let name = e.target.name;
  let value = e.target.value;
  curState.active = name === 'active' ? value : state.active;
  curState.condition = name === 'condition' ? value : state.condition;
  curState.manufactorer = name === 'manufactorer' ? value : state.manufactorer;
  return curState;
};
