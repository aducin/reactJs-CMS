import React from 'react';

import Config from '../../../Config';
import Input from '../../dumb/Input.jsx';
import Label from '../../dumb/Label.jsx';

const secondLine = (props) => {
  return(
    <div class="col-xs-12 marginTop20px">
      <Label name={Config.message.orders.typeShipmentNumber.name} labelClass="marginTop10px" />
      <Input
        placeholder={Config.message.orders.typeShipmentNumber.placeholder}
        changeHandler={(e) =>props.action(e)}
        name="shipment"
        value={props.curShipment}
      />
    </div>
  );
};

export default secondLine;
