import { checkIfModified } from './checkIfModified';

export const checkUrl = (props, state) => {
  let action = false;
  let actionValue = state.action;
  let editionSearched = state.editionSearched;
  let historySearched = state.historySearched;
  let restoreList = state.restoreList;
  let simpleSearched = state.simpleSearched;
  let dispatch = false;
  if (props.params.action !== undefined && props.params.id !== undefined) {
    let modifiedData = checkIfModified(props.params, state);
    if (modifiedData) {
      action = true;
      actionValue = modifiedData.action;
      editionSearched = modifiedData.editionSearched;
      historySearched = modifiedData.historySearched;
      simpleSearched = false;
      dispatch = 'clearData';
    }
  } else if (state.restoreList) {
    action = true;
    actionValue = 'restoreList';
    editionSearched = false;
    restoreList = false;
  } else if (state.editionSearched || state.historySearched) {
    action = true;
    actionValue = 'clear';
    editionSearched = false;
    historySearched = false;
  }
  return {
    action: actionValue,
    dispatch,
    modify: action,
    editionSearched,
    historySearched,
    restoreList,
    simpleSearched
  };
}
