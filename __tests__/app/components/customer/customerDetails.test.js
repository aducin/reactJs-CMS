import React from 'react';
import TestRenderer from 'react-test-renderer';

import Config from '../../../../src/app/Config';
import CustomerDetails from '../../../../src/app/components/customer/CustomerDetails.jsx';

const address = 'test@test.com';
const empty = false;
const inProgress = false;
const mockFunction = () => { return false; };
const token = '';

const data = {
  success: true,
  empty: false,
  customer: {
    new: false,
    old: {
      id_customer: 4,
      email: 'test@test.com',
      firstname: "Albert",
      lastname: "Ducin",
      birthday: "1900-01-01",
      id_gender: 1,
      gender: "Pan"
    }
  },
  address: {
    id_address: 5,
    alias: 'test address',
    company: '',
    firstname: "Albert",
    lastname: "Ducin",
    address1: 'Test1',
    address2: 'Test2',
    postcode: "20-000",
    city: 'Lublin',
    phone: '',
    phone_mobile: '111-222-333'
  },
  id: {
    new: null,
    old: 4
  },
  orders: {
    new: null,
    old: [{
      id: 5,
      reference:"000000005",
      totalProduct: "50.00",
      totalShipping: "9.50",
      dateAdd: "2010-05-15 21:46:56",
      cartDetails: [{
        productId: 285,
        attributeId: 0,
        productName: 'Test product',
        productQuantity: 1,
        reduction: "0.000000",
        totalPrice: "50.000000",
        unitPrice: "50.000000"
      }]
    }]
  }
};

const details = TestRenderer.create(
  <CustomerDetails
    address={address}
    data={data}
    delete={mockFunction}
    disable={inProgress}
    empty={empty}
    message={Config.message}
    send={mockFunction}
    token={token}
    url={Config.url}
  />
);

describe('Customer details` snapshot', () => {
  it('CustomerDetails renders correctly', async () => {
    const tree = details.toJSON();
    expect(tree).toMatchSnapshot();
  });
});