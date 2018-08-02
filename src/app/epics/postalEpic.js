import { ajax } from 'rxjs/ajax';
import { ofType } from 'redux-observable';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import 'rxjs/add/operator/catch';

import Config from '../Config';

const url = Config.url;
const orderUrl = url.serverPath + url.pathPostal;

export const getData = action$ => {
  return action$.pipe(
    ofType('getPostal'),
    mergeMap(action =>
      ajax.getJSON( orderUrl + '/' + action.payload)
        .map(response => {
          return {
            type: 'setData',
            payload: response.list
          }
        })
        .catch( err => {
          return {
            type: 'error',
            payload: null
          }
        })
    )
  )
}
