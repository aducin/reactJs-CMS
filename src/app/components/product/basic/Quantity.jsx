import React from 'react';

import { checkWarning } from '../../../functions/product/basicModal/checkWarning';
import Config from '../../../Config';
import Input from '../../dumb/Input.jsx';
import Label from '../../dumb/Label.jsx';

const quantity = ( props ) => {
  let data = props.data;
  let state = props.state;
  let text = Config.message;
  let quantityBorder = checkWarning(state, 'quantity', 'borderWarning');
  let quantityError = checkWarning(state, 'quantity', 'classWarning');
  let quantityWarning = (data.quantity.old !== data.quantity.new && !isNaN(data.quantity.old)) ?
    <Warning text={text.differentQuantities} data={data.quantity.new} /> : null;
  return(
    <div>
      <Label labelClass={quantityError} heightRow="4" name="Ilość:" />
      <Input
        additionalClass={quantityBorder}
        heightRow="8"
        placeholder="Podaj ilość"
        changeHandler={ (e) => props.action(e) }
        name="amount" value={data.quantity.old}
        disable={ props.disabled }
      />
      {quantityWarning}
    </div>
  );
};

export default quantity;
