import React from 'react';

const headers = (props) => {
  if (props.action === 'voucher') {
    const voucherFields = ['Numer ID', 'Referencja', 'Koszt produktów', 'Koszt transportu', 'Data', 'Number kuponu'];
    let headerArray = voucherFields.map((el, index) => {
      return <th key={index} class="col-xs-2 textAlignCenter">{el}</th>;
    });
    return(
      <tr>
        {headerArray}
      </tr>
    );
  } else if (props.action === 'even') {
    let currentPanel = props.db === 'new' ? 'NP' : 'SP';
    let otherPanel = props.db === 'new' ? 'SP' : 'NP';
    return(
      <tr>
        <th class="col-xs-1 textAlignCenter">Miniatura<br/>(SP)</th>
        <th class="col-xs-1 textAlignCenter">Numer<br/>ID</th>
        <th class="col-xs-4 textAlignCenter">Nazwa<br/>produktu</th>
        <th class="col-xs-1 textAlignCenter">Ilość<br/>(zakup)</th>
        <th class="col-xs-1 textAlignCenter">Ilość<br/>({currentPanel})</th>
        <th class="col-xs-1 textAlignCenter">Przed<br/>({otherPanel})</th>
        <th class="col-xs-1 textAlignCenter">Po<br/>({otherPanel})</th>
        <th class="col-xs-2 textAlignCenter">Akcja /<br/>Linki</th>
      </tr>
    );
  } else if (props.action === 'default') {
    return (
      <tr>
        <th class="col-xs-1 textAlignCenter">Miniatura</th>
        <th class="col-xs-1 textAlignCenter">Numer ID</th>
        <th class="col-xs-4 textAlignCenter">Nazwa</th>
        <th class="col-xs-2 textAlignCenter">Na stanie</th>
        <th class="col-xs-2 textAlignCenter">Na stanie<br/>(drugi sklep)</th>
        <th class="col-xs-1 textAlignCenter">Zamówione</th>
        <th class="col-xs-1 textAlignCenter">Opcje</th>
      </tr>
    );
  }
};

export default headers;
