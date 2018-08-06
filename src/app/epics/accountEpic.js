import { ajax } from 'rxjs/ajax';
import { ofType } from 'redux-observable';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import 'rxjs/add/operator/catch';

import Config from '../Config';
import { appendTime } from '../functions/account/appendTime';
import { getAmounts } from '../functions/account/getAmounts';
import { getTaxes } from '../functions/account/getTaxes';

const pathUrl = Config.url.serverPath + 'accounts';

const setParams = (obj) => {
  let url = pathUrl + '/' + obj.token;
  if (obj.params) {
    let paramsArray = [];
    for (let key in obj.params) {
      paramsArray.push( key + '=' + obj.params[key] );
    }
    url += '?' + paramsArray.join("&");
  }
  return url;
}

export const getAccounts = action$ => {
  return action$.pipe(
    ofType('getData'),
    mergeMap(action =>
    ajax.getJSON( setParams(action.payload) )
      .map(response => {
        let finalObj = {...response};
        if (response.list) {
          let amounts = getAmounts(response.list);
          finalObj.amounts = getTaxes(amounts);
          finalObj.list = appendTime(response.list);
        }
        return {
          type: 'set_list',
          payload: finalObj
        }
      })
      .catch( err => {
          return {
            type: 'set_error',
            payload: null
          }
        })
    )
  );
}
