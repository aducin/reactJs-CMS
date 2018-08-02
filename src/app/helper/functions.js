import Config from '../Config';

export const clearUrl = (containerPath) => {
  let url = Config.url.path + Config.url.pathSuffix + containerPath;
  window.location = url;
}

export const createReducedObj = (src, keys) => keys.reduce((obj, key) => {
  obj[key] = src[key];
  return obj;
}, {});

export const setUrl = (path, secondPath, token) => {
  let url = Config.url.serverPath + Config.url[path] + '/' + secondPath;
  if (token) {
    url += '/' + token;
  }
  return url;
}

