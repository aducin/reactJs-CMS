import React from 'react';

import Config from '../../../Config';
import Label from '../../dumb/Label.jsx';

const description = ( props ) => {
  return(
    <div>
      <Label heightRow="3" name={Config.message.labels.description.nameFull} />
      <div class="col-xs-12 col-md-9">
      <textarea
        class="form-control"
        rows="6"
        onKeyUp={ props.action.bind(this) }
        defaultValue={props.product.description}
        disabled={props.disabled}
        placeholder={Config.message.labels.description.placeholder}>
      </textarea>
      </div>
    </div>
  );
};

export default description;
