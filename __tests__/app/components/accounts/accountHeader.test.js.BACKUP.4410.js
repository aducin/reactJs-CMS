import React from 'react';
import TestRenderer from 'react-test-renderer';
import DatePicker from 'react-datepicker';

import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Config from '../../../../src/app/Config';
import AccountHeader from '../../../../src/app/components/account/AccountHeader.jsx';
import Select from '../../../../src/app/components/dumb/Select.jsx';
import state from '../../../../src/app/helper/accountState';
import Title from '../../../../src/app/components/dumb/Title.jsx';

<<<<<<< HEAD
configure({ adapter: new Adapter() });

=======
>>>>>>> e2e4aafc1a4c156f74946b8ff56f87928b142e4f
let link = undefined;
const mockFunction = () => { return false; };
let disable = false;
let selected = {
  type: -1,
<<<<<<< HEAD
  state: 2,
  dateFrom: null,
  dateTo: null
=======
    state: -1,
    dateFrom: null,
    dateTo: null
>>>>>>> e2e4aafc1a4c156f74946b8ff56f87928b142e4f
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

const component = (
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
<<<<<<< HEAD
  />
=======
/>
>>>>>>> e2e4aafc1a4c156f74946b8ff56f87928b142e4f
);
const accountHeader = TestRenderer.create(component);

const checkDisabled = (wrapper) => {
  let array = [];
  const disabledButtons = wrapper.findWhere(n => {
    let disabled = 0;
    if (n.props().type !== undefined && n.props().disabled) {
      disabled++;
      array.push(n.props().value);
    }
    return disabled;
  });
  return [disabledButtons, array];
}

describe('AccountHeader snapshot', () => {
  it('AccountHeader renders correctly', async () => {
    const tree = accountHeader.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('AccountHeader tests', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(component);
  });
  it('Component renders title correctly', () => {
    expect(wrapper.find(Title).props().title).toContain("Manager rachunków Ad9BIS");
  });
  it('there are 2 datepickers', () => {
    expect(wrapper.find(DatePicker)).toHaveLength(2);
  });
  it('there are 5 options in the first \<Select>\ tag', () => {
    expect(wrapper.find(Select).first().props().list).toHaveLength(5);
  });
  it('second \<Select>\ tag has a value of 2', () => {
    expect(wrapper.find(Select).last().props().value).toEqual(2);
  });
  it('there are 2 disabled input buttons with specified names', () => {
    let data = checkDisabled(wrapper);
    expect(data[0]).toHaveLength(2);
    expect(data[1]).toEqual(["Edytuj rachunek", "Wygeneruj plik"]);
  });
  it('there is no disabled input buttons anymore', () => {
    wrapper.setProps({ link: 'www.test.bebebe', selectedRow: 1 });
    let data = checkDisabled(wrapper);
    expect(data[0]).toHaveLength(0);
    expect(data[1]).toEqual([]);
  });
});
