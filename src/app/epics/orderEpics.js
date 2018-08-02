import { ajax } from 'rxjs/ajax';
import { ofType } from 'redux-observable';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import 'rxjs/add/operator/catch';

import Config from '../Config';

const url = Config.url;
const orderUrl = url.serverPath + url.pathOrder;

const setAdditionalObj = (action, data, db, id) => {
  return {
    type: 'additionalTask',
    payload: { action, data, db, id }
  };
}
const setData = (action, response) => {
  return {
    type: action,
    payload: response
  }
}
const setError = () => {
  return {
    type: 'orderError',
    payload: true
  }
}
const setFinalAction = (action) => {
  return action === 'new' ? 'orderIdNew' : 'orderIdOld';
}
const setUrl = (object, last = null) => {
  if (last) {
    return orderUrl + '/' + object.db + '/' + object.id + '/' + last
  } else {
    return orderUrl + '/' + object.db + '/' + object.id;
  }
}
const setUrlCustomer = (object) => {
  return url.serverPath + 'customer' + '/' + object.db + '/' + object.id + '/vouchers/' + object.token;
}

export const setAdditional = action$ => {
  return action$.pipe(
    ofType('setAdditionalAction'),
    mergeMap(action =>
      ajax.getJSON( setUrl(action.payload) + '?action=' + action.payload.action )
        .map(response => {
          return setAdditionalObj(action.payload.action, response, action.payload.db, action.payload.id);
        })
        .catch( error => setError() )
    )
  );
}

export const setEvenOrder = action$ => {
  return action$.pipe(
    ofType('setEven'),
    mergeMap(action =>
      ajax.put( setUrl(action.payload, 'even'))
        .map(ajaxData => {
          return setAdditionalObj('even', ajaxData.response, action.payload.db, action.payload.id);
        })
        .catch( error => setError() )
    )
  )
}

export const setSingleOrder = action$ => {
  return action$.pipe(
    ofType('setOrder'),
    mergeMap(action =>
      ajax.getJSON( setUrl(action.payload, action.payload.token) )
        .map(response => {
          let finalAction = setFinalAction(action.payload.db);
          response.id = action.payload.id;
          return setData(finalAction, response);
        })
        .catch( error => setError() )
    )
  );
};

export const setVoucher = action$ => {
  return action$.pipe(
    ofType('setVoucher'),
    mergeMap(action =>
      ajax.getJSON( setUrl(action.payload) + '?basic=true' )
        .map(response => {
          if (response.customer) {
            return setData('customerId', response.customer.id);
          } else {
            return setError();
          }
        })
        .catch( error => setError() )
    )
  );
};

export const voucherCustomer = action$ => {
  return action$.pipe(
    ofType('getCustomer'),
    mergeMap(action =>
    ajax.getJSON( setUrlCustomer(action.payload) )
      .map(response => {
        return setAdditionalObj('voucher', response, action.payload.db, action.payload.orderId);
      })
      .catch( error => setError() )
    )
  );
}
