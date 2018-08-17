import React from 'react';

import Config from '../../Config';
import Label from '../dumb/Label.jsx';
import Title from '../dumb/Title.jsx';

const customerHeader = ( props ) => {
  let message = Config.message;
  return(
    <div class="container bgrContent borderRadius10 marginTop40px paddingBottom40px">
      <div class="col-xs-12">
        <Title title={message.title.customers} />
        <div class="col-xs-12 marginTop10px">
          <Label heightRow="3" name={ message.customer.address } />
          <div class="col-xs-12 col-md-3">
            <input
              class="form-control textAlignCenter"
              type="text"
              disabled={props.disable}
              name="address"
              value={props.address.text}
              placeholder={message.labels.email}
              onChange={ (e) => props.setAddress(e) }
            />
          </div>
          <div class="col-xs-12 col-md-3">
            <input
              class="form-control btn btn-primary cursorPointer"
              disabled={props.disable || !props.address.valid}
              type="button"
              value={message.orders.find}
              onClick={ () => props.searchCustomer() }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default customerHeader;
