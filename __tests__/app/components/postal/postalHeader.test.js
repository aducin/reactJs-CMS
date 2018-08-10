import React from 'react';
import TestRenderer from 'react-test-renderer';
import Config from '../../../../src/app/Config';
import PostalHeader from '../../../../src/app/components/postal/PostalHeader.jsx';

let curAmount;
//let data;
const amount = 80.60;
const disabled = false;
const mockFunction = () => { return false; };

const postalHeader = TestRenderer.create(
  <PostalHeader
    amount={amount}
    disable={disabled}
    message={Config.message}
    openModal={mockFunction}
  />
);

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

describe('Postal snapshot', () => {
  it('PostalHeader renders correctly', async () => {
    const tree = postalHeader.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

