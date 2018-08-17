import React from 'react';

import Config from '../../../Config';
import Title from '../../dumb/Title.jsx';

const empty = (props) => {
  return (
    <div class="container bgrContent borderRadius10 marginTop40px paddingBottom40px">
      <div class="col-xs-12">
        <div class="col-xs-12">
          <Title title={Config.message.orders.noAction} />
        </div>
      </div>
    </div>
  );
};

export default empty;
