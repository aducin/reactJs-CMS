import React from 'react';
import TestRenderer from 'react-test-renderer';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Config from '../../../../src/app/Config';
import PostalHeader from '../../../../src/app/components/postal/PostalHeader.jsx';
import Title from '../../../../src/app/components/dumb/Title.jsx';

configure({ adapter: new Adapter() });

let curAmount;
//let data;
const amount = 80.60;
const disabled = false;
const mockFunction = () => { return false; };

const component = (
  <PostalHeader
    amount={amount}
    disable={disabled}
    message={Config.message}
    openModal={mockFunction}
  />
);
const message = Config.message;
const postalHeader = TestRenderer.create(component);

/*
const setData = () => {
  data = getPostal();
  return data.then((res) => {
    curAmount = res.current;
    console.log(curAmount);
    return res;
  });
};

beforeAll(() => {
  return setData();
});
*/

describe('Postal header snapshot', () => {
  it('PostalHeader renders correctly', async () => {
    const tree = postalHeader.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Postal header tests', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(component);
  });
  it('Component renders title correctly', () => {
    expect(wrapper.find(Title).props().title).toContain("Manager wysyłek Ad9BIS");
  });
  it('should find 2 \<h3>\ elements', () => {
    expect(wrapper.find('h3')).toHaveLength(2);
  });
  it('last header renders correctly', () => {
    expect(wrapper.find('h3').last().text()).toEqual('80.6zł');
  });
  it('first input should have type button', () => {
    expect(wrapper.find('input').first().props().type).toEqual('button');
  });
  it('last input should have correct value', () => {
    expect(wrapper.find('input').last().props().value).toEqual('Odejmij kwotę');
  });
});

