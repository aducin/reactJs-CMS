import React from 'react';

import Config from '../../../Config';
import { setIcon } from '../../../functions/jsx/account.jsx';

const header = ( props ) => {
  let headArray = Config.accountColumns.map((el, index) => {
    if (el.value) {
      let icon = setIcon(el.value, props.sortBy, props.ascending);
      return (
        <th onClick={() => props.action(el.value)} key={index} class="textAlignCenter cursorPointer">{el.name}<i class={icon} style={Config.leftMargin} aria-hidden="true"></i></th>
      );
    } else {
      return <th key={index} class="textAlignCenter">{el.name}</th>;
    }
  });
  return (
    <thead>
    <tr>{headArray}</tr>
    </thead>
  );
};

export default header;
