import React from 'react';
import TestRenderer from 'react-test-renderer';

import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Config from '../../../../src/app/Config';
import PostalDetail from '../../../../src/app/components/postal/PostalDetail.jsx';
import Title from '../../../../src/app/components/dumb/Title.jsx';

configure({ adapter: new Adapter() });

let data = {
  list: [
    {
      number: 1,
      current: 80.60,
      date: "2018-06-20 18:24:18"
    },
    {
      number: 2,
      current: 71.55,
      date: "2018-06-20 13:08:14"
    },
    {
      number: 3,
      current: 102.50,
      date: "2018-06-18 16:53:44"
    }
  ],
  success: true,
  current: 80.60
};
const message = Config.message;
const component = (
  <PostalDetail
    list={data.list}
    message={Config.message}
  />
);
const details = TestRenderer.create(component);

describe('Postal details', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(component);
  });

  it('PostalDetails renders correctly', async () => {
    const tree = details.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Component renders title correctly', () => {
    expect(wrapper.find(Title).props().title).toContain("Historia zmian (ostatnie 5 wpisów):");
  });
  it('should find a table with both classes', () => {
    expect(wrapper.find('.table').hasClass('table-striped')).toBeTruthy();
  });
  it('should find 3 table rows', () => {
    expect(wrapper.find('tbody').children()).toHaveLength(3);
  });
  it('should find the children', () => {
    expect(wrapper.find('tr').get(1).props.children).toHaveLength(3);
  });
  it('should find 4 tr nodes', () => {
    expect(wrapper.find('tr')).toHaveLength(4);
  });
  it('should find the first header`s column', () => {
    expect(wrapper.find('.col-xs-1').first().text()).toContain('LP.');
  });
  it('should find the last table column', () => {
    expect(wrapper.find('.col-xs-6').last().text()).toContain('2018-06-18 16:53:44');
  });
  it('should find the class name', () => {
    expect(wrapper.find('tr').get(1).props.className).toEqual('textAlignCenter');
  });
});