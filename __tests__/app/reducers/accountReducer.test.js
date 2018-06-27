import React from 'react';

import * as reducer from '../../../src/app/reducers/accountReducer.jsx';
import * as accountActions from '../../../src/app/actions/accountActions.jsx';

const accountReducer = reducer.accountReducer;
let actions = ['clear_data', 'set_error', 'set_list'];
let initialState = {
  amount: null,
  automatic: false,
  empty: undefined,
  list: null,
  dateFrom: null,
  dateTo: null,
  error: false,
  maxAmount: null,
  message: false
};
let message = '';

describe('Account reducer', () => {
  it('should clear data', () => {
    let dataObj = {
      type: actions[0],
      payload: null
    };
    expect(accountReducer(initialState, dataObj)).toEqual({
      amount: null,
      automatic: false,
      empty: undefined,
      error: false,
      dateFrom: null,
      dateTo: null,
      list: null,
      maxAmount: null,
      message: false,
    });
  });
  it('should set error', () => {
    let dataObj = {
      type: actions[1],
      payload: message
    };
    expect(accountReducer(initialState, dataObj)).toEqual({
      amount: null,
      automatic: false,
      empty: undefined,
      error: dataObj.payload,
      dateFrom: null,
      dateTo: null,
      list: null,
      maxAmount: null,
      message: false,
    });
  });
  it('should set list', () => {
    let dataObj = {
      type: actions[2],
      payload: initialState
    };
    expect(accountReducer(initialState, dataObj)).toEqual({
      amount: dataObj.payload.amount,
      automatic: dataObj.payload.automatic,
      empty: dataObj.payload.empty,
      error: false,
      dateFrom: dataObj.payload.dateFrom,
      dateTo: dataObj.payload.dateTo,
      list: dataObj.payload.list,
      maxAmount: dataObj.payload.maxAmount,
      message: dataObj.payload.message,
    });
  });
});