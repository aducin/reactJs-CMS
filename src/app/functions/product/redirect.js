import Config from '../../Config';

export const redirect = (path, id) => {
  window.location = Config.url.path + Config.url.pathSuffix + Config.url.pathProducts + '/' + path + '/' + id;
}
