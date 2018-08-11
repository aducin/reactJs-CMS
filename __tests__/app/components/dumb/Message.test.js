import React from 'react';
import TestRenderer from 'react-test-renderer';

import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Config from '../../../../src/app/Config';
import Message from '../../../../src/app/components/dumb/Message.jsx';

configure({ adapter: new Adapter() });

const messageStyle = 'alert alert-danger alertHeight textAlignCenter';
const randomMessage = 'Just a test';

const component = (
  <Message
    message={randomMessage}
    messageStyle={messageStyle}
  />
);
const testMessage = TestRenderer.create(component);

describe('Message snapshot', () => {
  it('Message renders correctly', () => {
    const tree = testMessage.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
describe('Tests of the message component', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(component);
  });
  it('P tag renders correct text', () => {
    expect(wrapper.find('p').text()).toContain("Just a test");
  });
  it('displays current classes correctly', () => {
    let classWrapper = wrapper.find('div').first().children().at(1).children().first().props().className;
    expect(classWrapper).toContain("alert alert-danger alertHeight textAlignCenter");
  });
  it('P tag renders updated text', () => {
    wrapper.setProps({ message: 'Another text' });
    expect(wrapper.find('p').text()).toContain("Another text");
  });
});
