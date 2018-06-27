import React from 'react';

import * as accountActions from '../../../src/app/actions/accountActions.jsx';

const data = {};

describe('Account actions', () => {
  it('should clear data', () => {
    const expectedAction = {
      type: 'clear_data',
      payload: null
    }
    expect(accountActions.clearData(data)).toEqual(expectedAction)
  });
  it('should set data', () => {
    const expectedAction = {
      type: 'set_list',
      payload: data
    }
    expect(accountActions.setList(data)).toEqual(expectedAction)
  });
  it('should set error', () => {
    const expectedAction = {
      type: 'set_error',
      payload: data
    }
    expect(accountActions.setError(data)).toEqual(expectedAction)
  });
});