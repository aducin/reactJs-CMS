import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import { Modal } from 'react-bootstrap';

import Config from '../../Config';
import { createReducedObj } from '../../functions/createReducedObj';
import Footer from '../account/modal/Footer.jsx';
import Input from '../dumb/Input.jsx';
import InputRow from '../account/modal/InputRow.jsx';
import Label from '../dumb/Label.jsx';
import Select from '../dumb/Select.jsx';

const accountModal = ( props ) => {
  const bodyHeight = { height: '680px'};
  const message = Config.message;
  const disable = props.disable;
  let title = props.modalMessage.text ? props.modalMessage.text : props.title;
  let titleClass;
  if (props.modalMessage.type) {
    titleClass = props.modalMessage.type === 'success' ? 'colorSuccess' : 'colorWarning';
  }
  let labelError = Config.accountNumbers.reduce((obj, key) => {
    obj[key] = props.error[key] ? 'colorWarning' : '';
    return obj;
  }, {});
  let action = props.handleChange;
  let data = props.data;
  let accessories = (
    <InputRow type="accessories" quantity="true" action={action} data={data} disable={disable} labelError={labelError} />
  );
  let amount = <InputRow type="amount" action={action} data={data} disable={disable} labelError={labelError} />;
  let book = <InputRow type="book" quantity="true" action={action} data={data} disable={disable} labelError={labelError} />;
  let cars = <InputRow type="car" quantity="true" action={action} data={data} disable={disable} labelError={labelError} />;
  let coaches = (
    <InputRow type="coach" quantity="true" action={action} data={data} disable={disable} labelError={labelError} />
  );
  let elements = (
    <InputRow type="element" quantity="true" action={action} data={data} disable={disable} labelError={labelError} />
  );
  let footer = <Footer close={props.close} disabled={props.data.saveDisabled} save={props.saveModal} />;
  let locs = <InputRow type="locs" quantity="true" action={action} data={data} disable={disable} labelError={labelError} />;
  let receipt = <InputRow type="receipt" action={action} data={data} disable={disable} labelError={labelError} />;
  let recipient = <InputRow type="recipient" action={action} data={data} disable={disable} labelError={labelError} />;
  let remarks = (
    <InputRow type="remarks" action={action} data={data} disable={disable} heightRow="4" inputHeight="8" labelError={labelError} />
  );
  let shipment = <InputRow type="address" action={action} data={data} disable={disable} labelError={labelError} />;
  return(
    <Modal show={ props.show !== false } onHide={ () => props.close() }>
      <Modal.Header closeButton>
        <Modal.Title class={titleClass}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={bodyHeight}>
        <Select
          curClass="col-xs-12" list={ props.types } name="type" selectChange={ action.bind(this) }
          setDisabled={ props.disable } title={ message.account.type } value={ props.data.type }
        />
        <Select
          curClass="col-xs-12 marginTop10px" list={ props.states } name="closed" selectChange={ action.bind(this) }
          setDisabled={ props.disable } title={ message.account.state } value={ props.data.closed }
        />
        {recipient}
        {shipment}
        <div class="col-xs-12 marginTop10px">
          <Label heightRow="8" name={ message.account.cashDate } />
          <div class="col-xs-12 col-md-4">
            <DatePicker
              dateFormat="DD.MM.YYYY"
              todayButton={"Dzisiaj"}
              disabled={ props.disable }
              selected={ props.data.cashDate }
              onChange={ props.dateChangeHandler.bind(this, 'cash') }
              locale="pl-pl"
              className="form-control cursorPointer textAlignCenter"
              placeholderText={ message.labels.date }
            />
          </div>
        </div>
        <div class="col-xs-12 marginTop10px">
          <Label heightRow="8" name={ message.account.receiptDate } />
          <div class="col-xs-12 col-md-4">
            <DatePicker
              dateFormat="DD.MM.YYYY"
              todayButton={"Dzisiaj"}
              disabled={ props.disable }
              selected={ props.data.receiptDate }
              onChange={ props.dateChangeHandler.bind(this, 'receipt') }
              locale="pl-pl"
              className="form-control cursorPointer textAlignCenter"
              placeholderText={ message.labels.date }
            />
          </div>
        </div>
        {amount}
        {receipt}
        {locs}
        {coaches}
        {elements}
        {accessories}
        {book}
        {cars}
        {remarks}
      </Modal.Body>
      <Modal.Footer>
        {footer}
      </Modal.Footer>
    </Modal>
  );
};

export default accountModal;
