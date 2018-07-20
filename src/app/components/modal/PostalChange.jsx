import React from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'react-bootstrap';

import Input from '../dumb/Input.jsx';
import Label from '../dumb/Label.jsx';

const postalChange = ( props ) => {
  let bodyHeight = { height: '190px'};
  let curAmount = parseFloat(props.amount);
  let curAmountToChange = parseFloat(props.amountToChange);
  let curClass = props.error ? 'colorWarning marginTop10px' : 'marginTop10px';
  let message = props.message.postal;
  let number = props.show === 'add' ? curAmount + curAmountToChange : curAmount - curAmountToChange;
  let title = props.title;
  let titleClass;
  if (props.modalInProgress) {
    title = props.message.postal.inProgress;
  } else if (props.actionMessage.type) {
    title = props.actionMessage.text;
    titleClass = props.actionMessage.type === 'success' ? 'colorSuccess' : 'colorWarning';
  }
  number = number.toFixed(2);
  number += props.message.currency;
  return(
    <Modal show={ props.show !== false } onHide={ () => props.close() }>
      <Modal.Header closeButton>
        <Modal.Title class={titleClass}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={bodyHeight}>
        <div class="marginTop20px">
          <Label labelClass={curClass} heightRow="4" name={message.toChange} />
        </div>
        <Input heightRow="8" placeholder={message.typeAmount} changeHandler={ (e) => props.amountChangeHandler(e) } name="price" value={props.amountToChange} disable={ props.actionMessage.type || props.modalInProgress }/>
        <div class="col-xs-12 marginTop20px"></div>
        <Label heightRow="4" name={message.afterChange} />
        <Label heightRow="2" name={number} />
        <div class="col-xs-12 marginTop10px"></div>
        <div class="col-xs-12 col-md-4 pull-right">
          <input class="form-control btn btn-primary pull-right" type="button" value={message.saveAmount} onClick={ () => props.save() } disabled={ props.actionMessage.type || props.error || props.modalInProgress || curAmountToChange <= 0 } />
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default postalChange;