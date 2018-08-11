import React from 'react';
import TestRenderer from 'react-test-renderer';

import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Title from '../../../../src/app/components/dumb/Title.jsx';

configure({ adapter: new Adapter() });

const text = 'Just a test';
const style = { backgroundColor: 'red'};

const component = (
  <Title
    title={text}
    curStyle={style}
  />
);

const title = TestRenderer.create(component);

describe('Title snapshot', () => {
  it('Title renders correctly', () => {
    const tree = title.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
describe('Tests of the title component', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(component);
  });
  it('H3 tag renders correct text', () => {
    expect(wrapper.find('h3').text()).toContain("Just a test");
  });
  it('Div renders style correctly', () => {
    expect(wrapper.find('div').first().children().first().props().style).toMatchObject({"backgroundColor": "red"});
  });
  it('H3 tag renders updated text', () => {
    wrapper.setProps({ title: 'Another text' });
    expect(wrapper.find('h3').text()).toContain("Another text");
  });
});
