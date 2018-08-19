import React from 'react';

import Config from '../../../Config';
import Input from '../../dumb/Input.jsx';
import Label from '../../dumb/Label.jsx';

const footer = ( props ) => {
  const message = Config.message;
  return(
    <div class="col-xs-12">
      <div class="col-xs-6 col-sm-4 col-md-2 pull-right">
        <input
          class="btn btn-warning"
          type="button"
          onClick={ () => props.close() }
          value={ message.close }
        />
      </div>
      <div class="col-xs-6 col-sm-4 col-md-2 pull-right">
        <input
          class="btn btn-primary"
          type="button"
          disabled={props.disabled}
          onClick={ () => props.save() }
          value={ message.actions.save }
        />
      </div>
    </div>
  );
};

export default footer;
