import React from 'react';

import Href from '../../dumb/Href.jsx';
import Config from '../../../Config';

const buttons = (props) => {
  let goBackUrl = Config.url.path + Config.url.pathSuffix + 'customers';
  let showMailUrl = Config.url.serverPath + 'customer/mail/' + props.token + '?email=' + props.address + '&result=display';
  return (
    <div class="marginTop10px">
      <div class="col-xs-12 col-md-2 pull-left">
        <a href={goBackUrl} class="form-control btn btn-warning" disabled={props.disable}>{Config.message.goBack}</a>
      </div>
      <Href
        link={showMailUrl}
        classMain="col-xs-12 col-md-3 col-lg-2 pull-left"
        className="form-control btn btn-primary"
        content={Config.message.orders.showEmail}
      />
      <div class="col-xs-12 col-md-2">
        <input
          class="form-control btn btn-primary cursorPointer"
          type="button"
          disabled={props.disable}
          value={Config.message.customer.mailDetails}
          onClick={ () => props.send('send') }
        />
      </div>
      <div class="col-xs-12 col-md-2">
        <input
          class="form-control btn btn-primary cursorPointer"
          type="button"
          disabled={props.disable}
          value={Config.message.customer.mailTransfer}
          onClick={ () => props.send('transfer') }
        />
      </div>
      <div class="col-xs-12 col-md-2">
        <input
          class="form-control btn btn-danger cursorPointer"
          type="button" disabled={props.disable}
          value={Config.message.customer.delete}
          onClick={ () => props.delete() }
        />
      </div>
    </div>
  );
};

export default buttons;
