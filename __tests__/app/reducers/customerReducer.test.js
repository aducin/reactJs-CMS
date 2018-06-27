import React from 'react';

import * as reducer from '../../../src/app/reducers/customerReducer.jsx';
import * as customerActions from '../../../src/app/actions/customerActions.jsx';

const customerReducer = reducer.customerReducer;
let actions = ['clear_data', 'set_data'];
let custData = {
  address: '',
  customer: '',
  empty: false,
  id: 1,
  orders: []
};
let initialState = {
  address: {
    new: null,
    old: null
  },
  customer: {
    new: false,
    old: false
  },
  empty: true,
  id: {
    new: null,
    old: null
  },
  orders: {
    new: null,
    old: null
  }
};

describe('Customer reducer', () => {
  it('should clear data', () => {
    let dataObj = {
      type: actions[0],
      payload: {...initialState}
    };
    expect(customerReducer(initialState, dataObj)).toEqual( {...initialState} );
  });
  it('should set data', () => {
    let dataObj = {
      type: actions[1],
      payload: {...custData}
    };
    expect(customerReducer(initialState, dataObj)).toEqual({
      address: dataObj.payload.address,
      customer: dataObj.payload.customer,
      empty: dataObj.payload.empty,
      id: dataObj.payload.id,
      orders: dataObj.payload.orders
    });
  });
});