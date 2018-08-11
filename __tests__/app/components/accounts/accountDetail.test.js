import React from 'react';
import TestRenderer from 'react-test-renderer';

import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Config from '../../../../src/app/Config';
import AccountDetail from '../../../../src/app/components/account/AccountDetail.jsx';
import state from '../../../../src/app/helper/accountState';

configure({ adapter: new Adapter() });

const ascending = true;
const data = {
  amounts: {
    amount3: 10.99,
    amount17: 0,
    tax3: 3.88,
    tax17: 0
  },
  automatic: true,
  success: true,
  list: [
    {
      id: 1000,
      amount: 10.99,
      recipient: 'PayU',
      address: null,
      receipt: 9834,
      locs: null,
      coach: null,
      element: 10,
      accessories: 5,
      book: null,
      car: null,
      closed: 1,
      remarks: null,
      createTime: "2018-06-21 00:00:00",
      cashTime: "2018-06-21",
      receiptTime: "2018-06-22"
    }
  ]
};
const empty = false;
const mockFunction = () => { return false; };
const selectedRow = 1;
const sortBy = 'id';

const component = (
  <AccountDetail
    ascending={ascending}
    data={data}
    empty={empty}
    selectedRow={selectedRow}
    selectRow={mockFunction}
    sortTable={mockFunction}
    sortBy={sortBy}
  />
);
const details = TestRenderer.create(component);

describe('AccountHeader snapshot', () => {
  it('AccountDetails renders correctly', async () => {
    const tree = details.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('AccountDetails tests', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(component);
  });
  let newAmounts = {
    ...data.amounts,
    amount17: 1000,
    tax17: 170
  };
  let newData = {
    ...data,
    amounts: newAmounts
  };
  it('there are 4 table rows', () => {
    expect(wrapper.find('tr')).toHaveLength(4);
  });
  it('there are 5 table rows now', () => {
    wrapper.setProps({ data: newData });
    expect(wrapper.find('tr')).toHaveLength(5);
  });
  it('first row has 15 columns', () => {
    expect(wrapper.find('tr').first().children()).toHaveLength(15);
  });
  it('last row in the second column contains the following values', () => {
    expect(wrapper.find('tr').last().childAt(1).props().children).toEqual(["10.99", "zł"]);
  });
  it('last row in the second column contains now another values', () => {
    wrapper.setProps({ data: newData });
    expect(wrapper.find('tr').last().childAt(1).props().children).toEqual(["1000.00", "zł"]);
  });
});
