import Config from '../Config';

export const clearUrl = (containerPath) => {
  window.location = Config.url.path + Config.url.pathSuffix + containerPath;
}
