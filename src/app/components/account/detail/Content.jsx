import React from 'react';

import Config from '../../../Config';

const content = ( props ) => {
  let contentArray = props.list.map((el, index) => {
    let active = el.id === props.selectedRow;
    let activeClass = active ? 'selected cursorPointer textAlignCenter' : 'cursorPointer textAlignCenter';
    let closedClass = el.closed ? 'colorWarning' : 'colorSuccess';
    let remarks = el.remarks ? el.remarks : '---';
    return (
      <tr key={ index } onClick={ () => props.selectRow(el.id)} class={activeClass}>
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

export default content;
