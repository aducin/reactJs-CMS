export const checkIfModified = (params, state) => {
  let edition = params.action === 'edition' && state.editionSearched !== params.id;
  let history = params.action === 'history' && state.historySearched !== params.id;
  if (edition || history) {
    let action = params.action === 'edition' ? 'searchEdition' : 'searchHistory';
    let editionSearched = edition ? params.id : false;
    let historySearched = history ? params.id : false;
    return {action, edition, editionSearched, history, historySearched};
  } else {
    return false;
  }
}
