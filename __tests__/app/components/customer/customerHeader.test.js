import React from 'react';
import TestRenderer from 'react-test-renderer';
import Config from '../../../../src/app/Config';
import CustomerHeader from '../../../../src/app/components/customer/CustomerHeader.jsx';

const address = 'test@test.com';
const inProgress = false;
const mockFunction = () => { return false; };

const customerHeader = TestRenderer.create(
  <CustomerHeader
    address={address}
    disable={inProgress}
    message={Config.message}
    searchCustomer={mockFunction}
    setAddress={mockFunction}
  />
);

describe('Customer snapshot', () => {
  it('CustomerHeader renders correctly', async () => {
  const tree = customerHeader.toJSON();
  expect(tree).toMatchSnapshot();
});
});