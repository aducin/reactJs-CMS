import React from 'react';
import TestRenderer from 'react-test-renderer';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Config from '../../../../src/app/Config';
import CustomerDetails from '../../../../src/app/components/customer/CustomerDetails.jsx';
import Title from '../../../../src/app/components/dumb/Title.jsx';

configure({ adapter: new Adapter() });

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
    new: null,
    old: [{
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
    }]
  },
  id: {
    new: null,
    old: 4
  },
  orders: {
    new: null,
    old: [
      {
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
      },
      {
        id: 55,
        reference:"0000000055,",
        totalProduct: "100.00",
        totalShipping: "12.50",
        dateAdd: "2010-06-15 21:46:56",
        cartDetails: [{
          productId: 285,
          attributeId: 0,
          productName: 'Test product',
          productQuantity: 2,
          reduction: "0.000000",
          totalPrice: "100.000000",
          unitPrice: "112.500000"
        }]
      }
    ]
  }
};

const component = (
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
const details = TestRenderer.create(component);

describe('Customer details` snapshot', () => {
  it('CustomerDetails renders correctly', async () => {
    const tree = details.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Customer details` tests', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(component);
  });
  it('Component renders title correctly', () => {
    expect(wrapper.find(Title).props().title).toContain("Dane dotyczące klienta o adresie: test@test.com - Pan Albert Ducin");
  });
  it('There are 4 h3 tags in the template', () => {
    expect(wrapper.find('h3')).toHaveLength(4);
  });
  it('There are 2 tables in the template', () => {
    expect(wrapper.find('table')).toHaveLength(2);
  });
  it('First tbody has 1 row', () => {
    expect(wrapper.find('tbody').first().children()).toHaveLength(1);
  });
  it('Second tbody has 2 rows', () => {
    expect(wrapper.find('tbody').at(1).children()).toHaveLength(2);
  });
  it('Fourth column in the second row in the second tbody equals to "100.00zł"', () => {
    expect(wrapper.find('tbody').at(1).children().at(1).children().at(3).text()).toEqual("100.00zł");
  });
});
