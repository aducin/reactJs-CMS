import React from 'react';
import TestRenderer from 'react-test-renderer';

import Config from '../../../../src/app/Config';
import AccountHeader from '../../../../src/app/components/account/AccountHeader.jsx';
import state from '../../../../src/app/helper/accountState';

let link = undefined;
const mockFunction = () => { return false; };
let disable = false;
let selected = {
  type: -1,
    state: -1,
    dateFrom: null,
    dateTo: null
};
let selectedRow = null;
let stateOptions = Config.accountStates.map((el, index) => {
    return (
  <option key={ index } value={ el.id }>{ el.name }</option>
);
});
let typeOptions = Config.accountTypes.map((el, index) => {
  return (
    <option key={ index } value={ el.id }>{ el.name }</option>
  );
});
let xml = null;

const accountHeader = TestRenderer.create(
  <AccountHeader
    accountModal={mockFunction}
    createXml={mockFunction}
    dateChangeHandler={mockFunction}
    disable={disable}
    handleSelectChange={mockFunction}
    link={link}
    selected={selected}
    selectedRow={selectedRow}
    states={stateOptions}
    types={typeOptions}
    xml={xml}
/>
);

it('AccountHeader renders correctly', async () => {
  const tree = accountHeader.toJSON();
  expect(tree).toMatchSnapshot();
});
