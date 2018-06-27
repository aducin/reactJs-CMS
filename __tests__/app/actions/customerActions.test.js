import React from 'react';

import * as customerActions from '../../../src/app/actions/customerActions.jsx';

const data = {};

describe('Customer actions', () => {
  it('should clear data', () => {
    const expectedAction = {
      type: 'clear_data',
      payload: null
    }
    expect(customerActions.clearData(data)).toEqual(expectedAction);
  });
  it('should set data', () => {
    const expectedAction = {
      type: 'set_data',
      payload: data
    }
    expect(customerActions.setData(data)).toEqual(expectedAction);
  });
});