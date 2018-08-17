import React from 'react';
import { Link } from 'react-router';

import ButtonSingle from '../../dumb/ButtonSingle.jsx';
import Config from '../../../Config';
import Href from '../../dumb/Href.jsx';

const buttons = (props) => {
  let result;
  let message = Config.message;
  if (props.name === 'additional') {
    let showMailUrl;
    if (props.details.additionalTask === 'discount') {
      showMailUrl = Config.url.serverPath + 'orders/' + props.details.currentDb + '/' + props.details.currentId + '/mail?action=discount&result=display';
    } else if (props.details.additionalTask === 'mail') {
      showMailUrl = Config.url.serverPath + 'orders/' + props.details.currentDb + '/' + props.details.currentId + '/mail?action=undelivered&result=display';
    }
    result = (
      <div class="marginTop10px">
        <Href
          link={showMailUrl}
          classMain="col-xs-12 col-md-3 pull-left"
          className="form-control btn btn-primary"
          content={message.orders.showEmail}
        />
        <div class="col-xs-12 col-md-3">
          <input
            class="form-control btn btn-primary cursorPointer"
            type="button"
            value={message.orders.send}
            onClick={ () => props.send() }
          />
        </div>
        <ButtonSingle
          link="orders"
          classMain="col-xs-12 col-md-3"
          className="form-control btn btn-danger"
          content={message.orders.delete}
        />
      </div>
    );
  } else if (props.name === 'default') {
    let even = 'orders/' + props.details.currentDb + '/' + props.details.currentId + '/even' ;
    let buttonsArray = [];
    buttonsArray.push(
      <ButtonSingle
        key="1"
        link={even}
        classMain="col-xs-12 col-md-3"
        className="form-control btn btn-primary"
        content={message.orders.even}
      />
    );
    buttonsArray.push(
      <ButtonSingle
        key="2"
        link="orders"
        classMain="col-xs-12 col-md-3"
        className="form-control btn btn-danger"
        content={message.orders.delete}
      />
    );
    if (!props.number) {
      buttonsArray.push(
        <div key="3" class="col-xs-12 col-md-3">
          <input
            class="form-control btn btn-primary cursorPointer"
            type="button"
            value={message.orders.shipmentNumber}
            onClick={ () => props.action() }
          />
        </div>
      );
    } else {
      buttonsArray.push(
        <div key="3" class="col-xs-12 col-md-3">
          <input
            class="form-control btn btn-danger cursorPointer"
            type="button"
            value={Config.message.goBack}
            onClick={ () => props.action() }
          />
        </div>
      );
      buttonsArray.push(
        <div key="4" class="col-xs-12 col-md-3">
          <input
            class="form-control btn btn-primary cursorPointer"
            disabled={props.shipment.length < 9}
            type="button" value={message.orders.send}
            onClick={ () => props.send(props.shipment) }
          />
        </div>
      );
    }
    result = (
      <div class="marginTop10px">
        {buttonsArray}
      </div>
    );
  } else if (props.name === 'even') {
    let orderUrl = 'orders/' + props.details.currentDb + '/' + props.details.currentId ;
    return(
      <div class="marginTop10px">
        <ButtonSingle
          link={orderUrl}
          classMain="col-xs-12 col-md-3"
          className="form-control btn btn-primary"
          content={message.orders.back}
        />
        <ButtonSingle
          link="orders"
          classMain="col-xs-12 col-md-3"
          className="form-control btn btn-danger"
          content={message.orders.delete}
        />
      </div>
    );
  } else if (props.name === 'voucher') {
    let curNumber = props.number;
    let showMailUrl = Config.url.serverPath + 'orders/' + props.details.currentDb + '/' + props.details.currentId +
      '/mail?action=voucher&result=display&voucherNumber=' + curNumber;
    result = (
      <div class="marginTop10px">
        <div class="col-xs-6 col-md-2 marginTop10px">
          <label>{message.orders.voucherNumber}</label>
        </div>
        <div class="col-xs-2 col-md-1 marginTop15px" data-tip={message.voucherPlus}>
          <i onClick={ () => props.action('add', curNumber) } class="fa fa-plus cursorPointer"></i>
        </div>
        <div class="col-xs-2 col-md-1 marginTop10px">
          {curNumber}
        </div>
        <div class="col-xs-2 col-md-1 marginTop15px" data-tip={message.voucherMinus}>
          <i onClick={ () => props.action('subtract', curNumber) } class="fa fa-minus cursorPointer"></i>
        </div>
        <Href
          link={showMailUrl}
          classMain="col-xs-12 col-md-3 col-lg-2 pull-left"
          className="form-control btn btn-primary"
          content={message.orders.showEmail}
        />
        <div class="col-xs-12 col-md-2">
          <input
            class="form-control btn btn-primary cursorPointer"
            type="button"
            value={message.orders.send}
            onClick={ () => props.send(curNumber) }
          />
        </div>
        <ButtonSingle
          link="orders"
          classMain="col-xs-12 col-md-2"
          className="form-control btn btn-danger"
          content={message.delete}
        />
      </div>
    );
  }
  return result;
};

export default buttons;
