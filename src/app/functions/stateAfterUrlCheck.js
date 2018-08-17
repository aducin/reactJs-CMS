export const stateAfterUrlCheck = (state, data) => {
  let curState = {...state};
  curState.action = data.action;
  curState.editionSearched = data.editionSearched;
  curState.historySearched = data.historySearched;
  curState.restoreList = data.restoreList;
  curState.simpleSearched = data.simpleSearched;
  return curState;
};
