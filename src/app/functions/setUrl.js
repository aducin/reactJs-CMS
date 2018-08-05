import Config from '../Config';

export const setUrl = (path, secondPath, token) => {
  let url = Config.url.serverPath + Config.url[path] + '/' + secondPath;
  if (token) {
    url += '/' + token;
  }
  return url;
}
