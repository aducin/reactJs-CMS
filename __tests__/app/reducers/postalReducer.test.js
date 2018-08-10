import React from 'react';

import * as reducer from '../../../src/app/reducers/postalReducer.jsx';
import * as postalActions from '../../../src/app/actions/postalActions.jsx';

const postalReducer = reducer.postalReducer;
let actions = ['error', 'setData', 'update'];
let arrData = [{current: null}];
let arrUpdate = {
  amount: 0,
  reason: 'success'
};
let initialState = {
  amount: undefined,
  error: false,
  list: null,
  updateSuccess: false
};
let message = '';

describe('Postal reducer', () => {
  it('should set error', () => {
    let dataObj = {
      type: actions[0],
      payload: message
    };
    expect(postalReducer(initialState, dataObj)).toEqual({
      amount: undefined,
      error: true,
      list: null,
      loading: false,
      updateSuccess: false
    });
  });
  it('should set data', () => {
    let dataObj = {
      type: actions[1],
      payload: arrData
    };
    expect(postalReducer(initialState, dataObj)).toEqual({
      amount: dataObj.payload[0].current,
      error: false,
      list: dataObj.payload,
      loading: false,
      updateSuccess: false
    });
  });
  it('should update data', () => {
    let dataObj = {
      type: actions[2],
      payload: arrData
    };
    expect(postalReducer(initialState, dataObj)).toEqual({
      amount: dataObj.payload.amount,
      error: initialState.error,
      list: initialState.list,
      updateSuccess: dataObj.payload.reason
    });
  });
});