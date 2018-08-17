import React from 'react';

import Config from '../../../Config';
import ButtonSingle from '../../dumb/ButtonSingle.jsx';

const buttons = ( props ) => {
  const message = Config.message;
  const product = props.product;
  const curUrl = 'products/history/' + product.id;
  let goBack;
  if (props.list) {
    goBack = (
      <div class="col-xs-12 col-md-3 pull-left">
        <input
          class="form-control btn btn-info pull-right"
          type="button"
          value={message.actions.goBackToList}
          onClick={ () => props.back() }
        />
      </div>
    );
  }
  return (
    <div>
      <div class="col-xs-12 col-md-3">
        <input
          class="form-control btn btn-primary"
          type="button"
          value={message.actions.save}
          onClick={ props.save.bind(this) }
        />
      </div>
      <ButtonSingle
        link={curUrl}
        classMain="col-xs-12 col-md-3"
        className="form-control btn btn-info"
        content={message.actions.history}
      />
      <ButtonSingle
        link="products"
        classMain="col-xs-12 col-md-3"
        className="form-control btn btn-info"
        content={message.actions.clear}
      />
      {goBack}
    </div>
  );
};

export default buttons;
