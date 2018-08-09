import Config from '../../Config';

export const setUrl = (data) => {
  let url;
  let urlData = Config.url;
  let action = data.action;
  if (action === "orderNew" || action === "orderOld" || action === 'remindNew' || action === 'remindOld') {
    let db = (action === 'orderNew' || action === 'remindNew') ? 'new' : 'old';
    url = urlData.path + urlData.pathSuffix + urlData.pathOrder + '/' + db + '/' + data.id;
    if (action === 'remindNew' || action === 'remindOld') {
      url = url + '/mail';
    }
  } else {
    url = urlData.path + urlData.pathSuffix + urlData.pathOrder + '/old/' + data.id + '/' + action;
  }
  return url;
}
