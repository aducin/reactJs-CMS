import React from 'react';

import Config from '../../Config';

const addDefaultOption = (obj) => {
  const message = Config.message.account;
  obj.unshift( <option key={ -1 } value={ message.defaultOption.id }>{ message.defaultOption.name }</option> );
  return obj;
};

export const renderComponent = (header, message, accountsHeader, busy, accountsDetails, modal) => {
  return (
    <div>
      {header}
      {message}
      {accountsHeader}
      {busy}
      {accountsDetails}
      {modal}
      <div class="col-xs-4 pull-left marginBottom40"></div>
    </div>
  )
};

export const setList = (obj, selected) => {
  let list = Config[obj].map((el, index) => <option key={ index } value={ el.id }>{ el.name }</option>);
  if (selected === -1) {
    list = addDefaultOption([...list]);
  }
  return list;
};
