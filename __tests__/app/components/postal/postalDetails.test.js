import React from 'react';
import TestRenderer from 'react-test-renderer';

import Config from '../../../../src/app/Config.jsx';
import PostalDetail from '../../../../src/app/components/postal/PostalDetail.jsx';

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


const details = TestRenderer.create(
  <PostalDetail
    list={data.list}
    message={Config.message}
  />
);

describe('Postal details` snapshot', () => {
  it('PostalDetails renders correctly', async () => {
    const tree = details.toJSON();
    expect(tree).toMatchSnapshot();
  });
});