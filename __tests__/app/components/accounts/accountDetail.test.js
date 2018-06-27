import React from 'react';
import TestRenderer from 'react-test-renderer';

import Config from '../../../../src/app/Config.jsx';
import AccountDetail from '../../../../src/app/components/account/AccountDetail.jsx';
import state from '../../../../src/app/components/account/state.jsx';

const data = {
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
const mockFunction = () => { return false; };

const details = TestRenderer.create(
  <AccountDetail
    ascending={state.ascending}
    columns={Config.accountColumns}
    data={data}
    message={Config.message}
    selectedRow={state.selectedRow}
    selectRow={mockFunction}
    sortTable={mockFunction}
    sortBy={state.sortBy}
    types={Config.accountTypes}
  />
);

it('AccountDetails renders correctly', async () => {
  const tree = details.toJSON();
  expect(tree).toMatchSnapshot();
});
