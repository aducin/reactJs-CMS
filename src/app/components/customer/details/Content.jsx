import React from 'react';

import Address from './Address.jsx';
import Config from '../../../Config';
import Order from './Order.jsx';

const content = ( props ) => {
  let result;
  let address = <Address address={props.address[props.panel]} />
  let orders = <Order order={props.order[props.panel]} />
  if (props.notEmpty[props.panel]) {
    result = (
      <div class="col-xs-12 pull-left marginTop20px">
        <div class="col-xs-12">
          <h3>{Config.message.customer.detailsIndicator} - {Config.message.customer.panels[props.panel]}: </h3>
          <div class="col-xs-12">
            {address}
            {orders}
          </div>
        </div>
      </div>
    );
  } else {
    result = (
      <div class="col-xs-12">
        <h3>{Config.message.customer.noAccount[props.panel]}</h3>
      </div>
    );
  }
  return result;
};

export default content;