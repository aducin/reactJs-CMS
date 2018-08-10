import React from 'react';
import TestRenderer from 'react-test-renderer';

import Config from '../../../../src/app/Config';
import Header from '../../../../src/app/components/dumb/Header.jsx';

const disabled = false;
const mockFunction = () => { return false; };
const name = 'Postal';

const header = TestRenderer.create(
  <Header
active={name}
buttonHandler={mockFunction}
disable={disabled}
fields={Config.fields}
/>
);

describe('Postal snapshot', () => {
  it('Header renders correctly', () => {
    const tree = header.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
