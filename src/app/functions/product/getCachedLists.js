import { reactLocalStorage } from 'reactjs-localstorage';

export const getCachedLists = () => {
  let cached = reactLocalStorage.getObject('constant');
  if (cached !== undefined && cached.category !== undefined && cached.manufactorer !== undefined) {
    return {
      success: true,
      category: cached.category,
      manufactorer: cached.manufactorer
    };
  } else {
    return { success: false };
  }
}
