import React from 'react';
import TestRenderer from 'react-test-renderer';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Config from '../../../../src/app/Config';
import CustomerHeader from '../../../../src/app/components/customer/CustomerHeader.jsx';
import Title from '../../../../src/app/components/dumb/Title.jsx';

configure({ adapter: new Adapter() });

const address = {
  text: 'test@test.com',
  valid: true
};
const inProgress = false;
const mockFunction = () => { return false; };

const component = (
  <CustomerHeader
    address={address}
    disable={inProgress}
    message={Config.message}
    searchCustomer={mockFunction}
    setAddress={mockFunction}
  />
);
const customerHeader = TestRenderer.create(component);

describe('Customer snapshot', () => {
  it('CustomerHeader renders correctly', async () => {
    const tree = customerHeader.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Customer tests', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(component);
  });
  it('Component renders title correctly', () => {
    expect(wrapper.find(Title).props().title).toContain("Manager klientów Ad9BIS");
  });
  it('Text input contains "test@test.com"', () => {
    expect(wrapper.find('input').first().props().value).toEqual("test@test.com");
  });
  it('Button is enabled at the moment', () => {
    expect(wrapper.find('input').last().props().disabled).toBeFalsy();
  });
  it('Button is not enabled anymoret', () => {
    let address = {
      text: '',
      valid: false
    };
    wrapper.setProps({ address });
    expect(wrapper.find('input').last().props().disabled).toBeTruthy();
  });
});
