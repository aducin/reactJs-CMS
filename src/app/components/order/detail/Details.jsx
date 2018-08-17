import React from 'react';

import Config from '../../../Config';
import Row from '../../dumb/Row.jsx';

const labelWidth = 'col-xs-12 col-lg-4';
const paragraphWidth = 'col-xs-12 col-lg-8';

const details = (props) => {
  let result;
  let message = Config.message;
  if (props.name === 'default') {
    let customer = props.customer;
    let totalPaid =  props.data.totalPaid + Config.message.currency;
    let shortCut = props.details.orderData ? props.details.orderData : props.details.additionalData;
    let name = shortCut.customer.firstname + ' ' + shortCut.customer.lastname;
    let detailsArray = [];
    detailsArray.push(
      <div key="1" class="col-xs-12 marginTop10px">
        <Row label="Klient:" content={name} labelWidth={labelWidth} paragraphWidth={paragraphWidth}/>
      </div>
    );
    detailsArray.push(
      <div key="2" class="col-xs-12 marginTop10px">
        <Row label="Adres e-mail:" content={customer.email} labelWidth={labelWidth} paragraphWidth={paragraphWidth}/>
      </div>
    );
    if (!props.details.additionalTask) {
      detailsArray.push(
        <div key="3" class="col-xs-12 marginTop10px">
          <Row label="Kwota (zł):" content={totalPaid} labelWidth={labelWidth} paragraphWidth={paragraphWidth}/>
        </div>
      );
    }
    result = (
      <div class="container">{detailsArray}</div>
    );
  } else if (props.name === 'voucher') {
    result = (
      <div class="container">
        <div class="col-xs-12 marginTop20px">
          <Row label={message.orders.email} content={props.customer.email} />
        </div>
        <div class="col-xs-12 marginTop10px">
          <Row label={message.orders.voucherLast} content={props.data.lastVoucher} />
        </div>
      </div>
    );
  }
  return result;
}

export default details;
