import React from 'react';

import Config from '../../../Config';

const taxRow = ( props ) => {
  return (
    <tr>
      <td key="1" class="textAlignCenter">{ props.percent }</td>
      <td key="2" class="textAlignCenter">{ props.amount.toFixed(2) }{ Config.message.currency }</td>
      <td key="3" class="textAlignCenter">{ props.tax.toFixed(2) }{ Config.message.currency }</td>
    </tr>
  );
};

export default taxRow;