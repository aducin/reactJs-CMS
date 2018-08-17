import React from 'react';

import Config from '../../../Config';
import Input from '../../dumb/Input.jsx';
import Label from '../../dumb/Label.jsx';

const edition = ( props ) => {
  const labels = Config.message.labels;
  const type = props.type;
  let name = type !== 'tags' ? type : 'productTags';
  let curValue = type !== 'tags' ? props.value[type] : props.value;
  return (
    <div>
      <Label heightRow="3" name={labels[type].name} />
      <Input
        heightRow="9"
        placeholder={labels[type].placeholder}
        changeHandler={props.action.bind(this)}
        name={name} noCenter="true"
        disable={props.disabled}
        value={curValue}
      />
    </div>
  );
}

export default edition;
