import React from 'react';

import Config from '../../../Config';
import Title from '../../dumb/Title.jsx';

const summary = (props) => {
  let result;
  let message = Config.message;
  if (props.name === 'discount') {
    let data = props.data;
    let bottomDetails = (
      <div class="container marginTop10px">
        <div class="col-xs-12 col-lg-3 pull-left"></div>
        <div class="col-xs-12 col-lg-6 pull-left">
          <label class="col-xs-6">{message.orders.total}</label>
          <p class="col-xs-6">{data.totalPaid}{Config.message.currency}</p>
          <label class="col-xs-6">{message.orders.totalDiscount}</label>
          <p class="col-xs-6 colorWarning">{data.totalPaidDiscount}{Config.message.currency}</p>
          <label class="col-xs-6">{message.orders.totalShipping}</label>
          <p class="col-xs-6">{data.totalProduct}{Config.message.currency}</p>
          <label class="col-xs-6">{message.orders.totalShippingDiscount}</label>
          <p class="col-xs-6 colorWarning">{data.totalProductDiscount}{Config.message.currency}</p>
        </div>
        <div class="col-xs-12 col-lg-3 pull-left"></div>
      </div>
    );
    result = (
      <div class="marginTop20px">
        <Title title={message.orders.summary} />
        {bottomDetails}
      </div>
    );
  } else if (props.name === 'voucher') {
    result = (
      <div class="colorWarning marginTop10px">
        <Title title={message.orders.noVoucher} />
      </div>
    );
  }
  return result;
};

export default summary;
