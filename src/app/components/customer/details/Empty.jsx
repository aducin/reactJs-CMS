import React from 'react';

import Config from '../../../Config';
import Title from '../../dumb/Title.jsx';

const empty = () => {
  return(
    <div class="container bgrContent borderRadius10 marginTop40px paddingBottom20px">
      <div class="col-xs-12">
        <div class="col-xs-12">
          <Title title={Config.message.customer.typeAnAddress} />
        </div>
      </div>
    </div>
  );
};

export default empty;
