import React from 'react';

import Config from '../../../Config';
import Input from '../../dumb/Input.jsx';
import Label from '../../dumb/Label.jsx';

const inputRow = ( props ) => {
  const labelError = props.labelError;
  const message = Config.message;
  const type = props.type;
  let placeholder;
  if (props.quantity) {
    placeholder = message.labels.quantity.placeholder;
  } else {
    placeholder = message.labels[type];
  }
  let heightRow = props.heightRow ? props.heightRow : 8;
  let inputHeight = props.inputHeight ? props.inputHeight : 4;
  return(
    <div class="col-xs-12 marginTop10px">
      <Label
        labelClass={labelError[type]}
        heightRow={heightRow}
        name={ message.account[type] }
      />
      <Input
        heightRow={inputHeight}
        placeholder={ placeholder }
        changeHandler={ (e) => props.action(e) }
        name={props.type}
        disable={ props.disable }
        value={ props.data[type] }
      />
    </div>
  );
};

export default inputRow;
