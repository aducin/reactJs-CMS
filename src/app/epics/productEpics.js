import { reactLocalStorage } from 'reactjs-localstorage';

import { ajax } from 'rxjs/ajax';
import { ofType } from 'redux-observable';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import 'rxjs/add/operator/catch';

import Config from '../Config';

const pathUrl = Config.url.serverPath + Config.url.pathProducts;

const setError = () => {
  return {
    type: 'set_error',
    payload: null
  }
}

const setNameUrl = (params) => {
  let urlArray = [];
  for (let key in params) {
    urlArray.push(key + '=' + params[key]);
  }
  let joined = urlArray.join('&');
  return pathUrl + '?' + joined;
}

const setUrl = (type, params) => {
  if (type === 'id') {
    let url = pathUrl + '/' + params.id;
    if (params.basic) {
      url += '?basic=true';
    }
    return url;
  } else if (type === 'history') {
    return pathUrl + '/' + params.id + '/history';
  }
}

export const getByName = action$ => {
  return action$.pipe(
    ofType('getByParams'),
    mergeMap(action =>
      ajax.getJSON( setNameUrl(action.payload.params) )
        .map(response => {
          let finalData;
          if (response.success !== undefined) {
            return {
              type: 'set_empty',
              payload: {empty: true, reason: response.reason}
            }
          } else {
            return {
              type: 'set_name_result',
              payload: { list: response, anotherSearch: Boolean(action.payload.another)}
            }
          }
        })
        .catch( err => {
          setError();
        })
    )
  )
}

export const getById = action$ => {
  return action$.pipe(
    ofType('getProductById'),
    mergeMap(action =>
      ajax.getJSON( setUrl('id', action.payload) )
        .map(response => {
          if (action.payload.basic) {
            return {
              type: 'set_basic',
              payload: response
            }
          } else if (response.success !== false) {
            return {
              type: 'set_id_result',
              payload: response
            }
          } else {
            return {
              type: 'set_empty',
              payload: response.reason
            }
          }
        })
        .catch( err => {
          setError();
        })
    )
  )
}

export const getHistory = action$ => {
  return action$.pipe(
    ofType('getHistory'),
    mergeMap(action =>
      ajax.getJSON( setUrl('history', action.payload) )
        .map(response => {
          if (response.success !== false) {
            return {
              type: 'set_history',
              payload: { id: action.payload.id, list: response }
            }
          } else {
            return {
              type: 'set_history_empty',
              payload: action.payload.id
            }
          }
        })
        .catch( err => {
          setError();
        })
    )
  )
}

