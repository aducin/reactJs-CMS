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

export const setDetailsContent = (list, selectedRow, selectRow) => {
  let contentArray = list.map((el, index) => {
    let active = el.id === selectedRow;
    let activeClass = active ? 'selected cursorPointer textAlignCenter' : 'cursorPointer textAlignCenter';
    let closedClass = el.closed ? 'colorWarning' : 'colorSuccess';
    let remarks = el.remarks ? el.remarks : '---';
    return (
      <tr key={ index } onClick={ () => selectRow(el.id)} class={activeClass}>
        <td class={closedClass}>{index + 1}.</td>
        <td>{el.recipient}</td>
        <td>{el.address}</td>
        <td>{el.amount}{Config.message.currency}</td>
        <td>{el.typeName}</td>
        <td>{el.receipt}</td>
        <td>{el.receiptTime}</td>
        <td>{el.cashTime}</td>
        <td>{el.locs}</td>
        <td>{el.coach}</td>
        <td>{el.element}</td>
        <td>{el.accessories}</td>
        <td>{el.book}</td>
        <td>{el.car}</td>
        <td>{remarks}</td>
      </tr>
    );
  });
  return <tbody>{ contentArray }</tbody>;
};

export const setIcon = (value, field, ascending) => {
  let icon;
  if (value !== field) {
    icon = 'fa fa-sort';
  } else {
    if (ascending) {
      icon = 'fa fa-sort-desc';
    } else {
      icon = 'fa fa-sort-asc';
    }
  }
  return icon;
};

export const setList = (obj, selected) => {
  let list = [];
  list = Config[obj].map((el, index) => <option key={ index } value={ el.id }>{ el.name }</option>);
  if (selected === -1) {
    list = addDefaultOption([...list]);
  }
  return list;
};

export const setSummary = (row3, row17) => {
  return (
    <div class="col-xs-12 col-md-4 pull-left">
      <table class="table table-striped table-bordered">
        <thead>
        <tr>
          <th key="1" class="textAlignCenter">{ Config.message.account.summary }</th>
          <th key="2" class="textAlignCenter">{ Config.message.account.summaryAmount }</th>
          <th key="3" class="textAlignCenter">{ Config.message.account.summaryTax }</th>
        </tr>
        </thead>
        <tbody>
        { row3 }
        { row17 }
        </tbody>
      </table>
    </div>
  );
}

export const setTaxRow = (amount, tax, percent) => {
  return (
    <tr>
      <td key="1" class="textAlignCenter">{ percent }</td>
      <td key="2" class="textAlignCenter">{ amount.toFixed(2) }{ Config.message.currency }</td>
      <td key="3" class="textAlignCenter">{ tax.toFixed(2) }{ Config.message.currency }</td>
    </tr>
  );
};

export const setXml = (link, propsXml, createXml) => {
  let xml;
  if (link) {
    xml = (
      <div class="col-xs-12 col-sm-4 col-md-12 marginTop10px">
        <a href={link} download>{Config.message.account.downloadXml}</a>
      </div>
    );
  } else {
    xml = (
      <div class="col-xs-12 col-sm-4 col-md-12 marginTop10px">
        <input
          class="form-control btn btn-primary maxWidth160"
          disabled={!propsXml}
          onClick={ () => createXml() }
          type="button"
          value={ Config.message.account.createXml }
        />
      </div>
    );
  }
  return xml;
};
