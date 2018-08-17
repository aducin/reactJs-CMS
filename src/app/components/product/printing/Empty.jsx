import React from 'react';

import Config from '../../../Config';

const empty = ( props ) => {
  return (
    <div class="container">
      <div class="col-xs-12 col-md-10">
        <h3>{Config.message.noPrintings}</h3>
      </div>
      <div class="col-xs-12 col-md-2 marginTop15px paddingBottomResp">
        {props.inputs}
        {props.modal}
      </div>
    </div>
  )
};

export default empty;
