import React from 'react';
import TestRenderer from 'react-test-renderer';

import Config from '../../../../src/app/Config.jsx';
import AccountHeader from '../../../../src/app/components/account/AccountHeader.jsx';
import state from '../../../../src/app/components/account/state.jsx';

const mockFunction = () => { return false; };

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

const accountHeader = TestRenderer.create(
  <AccountHeader
    accountModal={mockFunction}
    createXml={mockFunction}
    dateChangeHandler={mockFunction}
    disable={state.inProgress}
    handleSelectChange={mockFunction}
    link={state.link}
    message={Config.message}
    selected={state.selected}
    selectedRow={state.selectedRow}
    states={stateOptions}
    types={typeOptions}
    xml={state.createXml}
/>
);

it('AccountHeader renders correctly', async () => {
  const tree = accountHeader.toJSON();
  expect(tree).toMatchSnapshot();
});
