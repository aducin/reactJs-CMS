import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Link } from 'react-router';

import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Config from '../../../../src/app/Config';
import Header from '../../../../src/app/components/dumb/Header.jsx';

configure({ adapter: new Adapter() });

const disabled = false;
const mockFunction = () => { return false; };
const name = 'products';

const component = (
  <Header
    active={name}
    buttonHandler={mockFunction}
    disable={disabled}
    fields={Config.fields}
  />
);
const header = TestRenderer.create(component);

describe('Header snapshot', () => {
  it('Header renders correctly', () => {
    const tree = header.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
describe('Header tests', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(component);
  });
  it('Header links have 5 items', () => {
    expect(wrapper.find(Link)).toHaveLength(5);
  });
  it('Header logout button has correct classes', () => {
    expect(wrapper.find('button').props().className).toEqual('btn btn-danger btn-block logoutButton headerButton');
  });
  it('First header link is disabled', () => {
    expect(wrapper.find(Link).first().props().disabled).toEqual(true);
  });
  it('Every link contains headerButton class', () => {
    wrapper.find(Link).forEach((node) => {
      expect(node.hasClass('headerButton')).toEqual(true);
    })
  });
  it('there are 4 disabled link buttons', () => {
    const complexComponents = wrapper.findWhere(n => {
      if (n.props().disabled !== undefined) {
        return n.props().disabled === false;
      }
    });
    expect(complexComponents).toHaveLength(4);
  });
  it('should match link buttons names', () => {
    const texts = wrapper.find(Link).map(node => node.props().children);
    expect(texts).toEqual(["Produkty", "Zamówienia", "Wysyłki", "Rachunki", "Klienci"]);
  });
  it('First header link is not disabled anymore', () => {
    wrapper.setProps({ active: 'postal' });
    expect(wrapper.find(Link).first().props().disabled).not.toEqual(true);
  });
});
