import React from 'react';

import Config from '../../../Config';
import Input from '../../dumb/Input.jsx';
import Label from '../../dumb/Label.jsx';

const quantity = ( props ) => {
  let curQuantity, quantityText;
  let message = Config.message;
  let tempQuantity = props.product.quantity;
  let quantityTextClass = ['col-xs-12', 'col-md-9', 'pull-right', 'textAlignRight'];
  if (tempQuantity) {
    curQuantity = tempQuantity.new;
    if (tempQuantity.new === tempQuantity.old) {
      quantityText = message.quantity.equal;
      quantityTextClass.push('colorSuccess');
    } else {
      quantityText = message.quantity.notEqual + tempQuantity.old;
      quantityTextClass.push('colorWarning');
    }
    quantityTextClass = quantityTextClass.join(' ');
  }
  return (
    <div>
      <Label name={Config.message.labels.quantity.name} />
      <Input
        placeholder={Config.message.labels.quantity.placeholder}
        changeHandler={props.action.bind(this)}
        name="quantity"
        disable={props.disabled}
        value={curQuantity}
      />
      <div class="col-xs-12 col-md-3 pull-left"></div>
      <div class={quantityTextClass}>{quantityText}</div>
    </div>
  );
};

export default quantity;
