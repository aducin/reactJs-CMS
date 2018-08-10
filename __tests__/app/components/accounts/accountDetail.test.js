import React from 'react';
import TestRenderer from 'react-test-renderer';

import Config from '../../../../src/app/Config';
import AccountDetail from '../../../../src/app/components/account/AccountDetail.jsx';
import state from '../../../../src/app/helper/accountState';

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

const details = TestRenderer.create(
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

it('AccountDetails renders correctly', async () => {
  const tree = details.toJSON();
  expect(tree).toMatchSnapshot();
});
