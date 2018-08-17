import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import { Modal } from 'react-bootstrap';

import Config from '../../Config';
import { createReducedObj } from '../../functions/createReducedObj';
import Input from '../dumb/Input.jsx';
import Label from '../dumb/Label.jsx';
import Select from '../dumb/Select.jsx';

const accountModal = ( props ) => {
  const bodyHeight = { height: '680px'};
  const marginLeft = { marginLeft: '-15px'};
  const message = Config.message;
  let title = props.modalMessage.text ? props.modalMessage.text : props.title;
  let titleClass;
  if (props.modalMessage.type) {
    titleClass = props.modalMessage.type === 'success' ? 'colorSuccess' : 'colorWarning';
  }
  let labelError = Config.accountNumbers.reduce((obj, key) => {
    obj[key] = props.error[key] ? 'colorWarning' : '';
    return obj;
  }, {});
  return(
    <Modal show={ props.show !== false } onHide={ () => props.close() }>
      <Modal.Header closeButton>
        <Modal.Title class={titleClass}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={bodyHeight}>
        <Select
          curClass="col-xs-12"
          setDisabled={ props.disable }
          list={ props.types }
          name="type"
          selectChange={ props.handleChange.bind(this) }
          title={ message.account.type }
          value={ props.data.type }
        />
        <Select
          curClass="col-xs-12 marginTop10px"
          setDisabled={ props.disable }
          list={ props.states }
          name="closed"
          selectChange={ props.handleChange.bind(this) }
          title={ message.account.state }
          value={ props.data.closed }
        />
        <div class="col-xs-12 marginTop10px">
          <Label cssStyle={marginLeft} heightRow="4" name={ message.account.order } />
          <Input
            heightRow="8"
            placeholder={ message.labels.order }
            changeHandler={ props.handleChange.bind(this) }
            name="recipient"
            disable={ props.disable }
            value={ props.data.recipient }
          />
        </div>
        <div class="col-xs-12 marginTop10px">
          <Label cssStyle={marginLeft} heightRow="4" name={ message.account.shipment } />
          <Input
            heightRow="8"
            placeholder={ message.labels.shipment }
            changeHandler={ props.handleChange.bind(this) }
            name="address"
            disable={ props.disable }
            value={ props.data.address }
          />
        </div>
        <div class="col-xs-12 marginTop10px">
          <Label cssStyle={marginLeft} heightRow="8" name={ message.account.cashDate } />
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
          <Label cssStyle={marginLeft} heightRow="8" name={ message.account.receiptDate } />
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
        <div class="col-xs-12 marginTop10px">
          <Label cssStyle={marginLeft} labelClass={labelError.amount} heightRow="8" name={ message.account.amount } />
          <Input
            heightRow="4"
            placeholder={ message.labels.amount }
            changeHandler={ props.handleChange.bind(this) }
            name="amount"
            disable={ props.disable }
            value={ props.data.amount }
          />
        </div>
        <div class="col-xs-12 marginTop10px">
          <Label cssStyle={marginLeft} labelClass={labelError.receipt} heightRow="8" name={ message.account.receipt } />
          <Input
            heightRow="4"
            placeholder={ message.labels.receipt }
            changeHandler={ props.handleChange.bind(this) }
            name="receipt"
            disable={ props.disable }
            value={ props.data.receipt }
          />
        </div>
        <div class="col-xs-12 marginTop10px">
          <Label cssStyle={marginLeft} labelClass={labelError.locs} heightRow="8" name={ message.account.locs } />
          <Input
            heightRow="4"
            placeholder={ message.labels.quantity.placeholder }
            changeHandler={ props.handleChange.bind(this) }
            name="locs"
            disable={ props.disable }
            value={ props.data.locs }
          />
        </div>
        <div class="col-xs-12 marginTop10px">
          <Label cssStyle={marginLeft} labelClass={labelError.coach} heightRow="8" name={ message.account.coaches } />
          <Input
            heightRow="4"
            placeholder={ message.labels.quantity.placeholder }
            changeHandler={ props.handleChange.bind(this) }
            name="coach"
            disable={ props.disable }
            value={ props.data.coach }
          />
        </div>
        <div class="col-xs-12 marginTop10px">
          <Label cssStyle={marginLeft} labelClass={labelError.element} heightRow="8" name={ message.account.elements } />
          <Input
            heightRow="4"
            placeholder={ message.labels.quantity.placeholder }
            changeHandler={ props.handleChange.bind(this) }
            name="element"
            disable={ props.disable }
            value={ props.data.element }
          />
        </div>
        <div class="col-xs-12 marginTop10px">
          <Label cssStyle={marginLeft} labelClass={labelError.accessories} heightRow="8" name={ message.account.accessories } />
          <Input
            heightRow="4"
            placeholder={ message.labels.quantity.placeholder }
            changeHandler={ props.handleChange.bind(this) }
            name="accessories"
            disable={ props.disable }
            value={ props.data.accessories }
          />
        </div>
        <div class="col-xs-12 marginTop10px">
          <Label cssStyle={marginLeft} labelClass={labelError.book} heightRow="8" name={ message.account.literature } />
          <Input
            heightRow="4"
            placeholder={ message.labels.quantity.placeholder }
            changeHandler={ props.handleChange.bind(this) }
            name="book"
            disable={ props.disable }
            value={ props.data.book }
          />
        </div>
        <div class="col-xs-12 marginTop10px">
          <Label cssStyle={marginLeft} labelClass={labelError.car} heightRow="8" name={ message.account.cars } />
          <Input
            heightRow="4"
            placeholder={ message.labels.quantity.placeholder }
            changeHandler={ props.handleChange.bind(this) }
            name="car"
            disable={ props.disable }
            value={ props.data.car }
          />
        </div>
        <div class="col-xs-12 marginTop10px">
          <Label cssStyle={marginLeft} heightRow="4" name={ message.account.remarks } />
          <Input
            heightRow="8"
            placeholder={ message.labels.remarks }
            changeHandler={ props.handleChange.bind(this) }
            name="remarks"
            disable={ props.disable }
            value={ props.data.remarks }
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div class="col-xs-12">
          <div class="col-xs-12 col-md-2 pull-right">
              <input class="btn btn-warning" type="button" onClick={ () => props.close() } value={ message.close } />
          </div>
          <div class="col-xs-12 col-md-2 pull-right">
            <input class="btn btn-primary" type="button" disabled={props.data.saveDisabled} onClick={ () => props.saveModal() } value={ message.actions.save } />
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default accountModal;
