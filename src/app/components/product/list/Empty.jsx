import React from 'react';

import Config from '../../../Config';
import Title from '../../dumb/Title.jsx';

const empty = (props) => {
  return(
    <div>
      <Title title={Config.message.noNameList} />
      <div class="col-xs-9 col-md-11 pull-left"></div>
      <div class="col-xs-3 col-md-1 pull-left">
        <input
          class="form-control btn btn-primary pull-right"
          type="button"
          value={Config.message.clear}
          onClick={ () => props.clear() }
        />
      </div>
    </div>
  );
};

export default empty;
