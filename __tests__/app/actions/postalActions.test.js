import React from 'react';

import * as postalActions from '../../../src/app/actions/postalActions.jsx';

const data = {};
const message = '';

describe('Postal actions', () => {
  it('should set data', () => {
    const expectedAction = {
      type: 'setData',
      payload: data
    }
    expect(postalActions.getAmount(data)).toEqual(expectedAction);
  });
  it('should set error', () => {
    const expectedAction = {
      type: 'error',
      payload: message
    }
    expect(postalActions.setError(message)).toEqual(expectedAction);
  });
  it('should update data', () => {
    const expectedAction = {
      type: 'update',
      payload: data
    }
    expect(postalActions.setUpdate(data)).toEqual(expectedAction);
  });
});