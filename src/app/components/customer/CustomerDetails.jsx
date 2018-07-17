import React from 'react';

import Helper from '../../helper/Helper.jsx';

import Href from '../dumb/Href.jsx';
import Label from '../dumb/Label.jsx';
import Title from '../dumb/Title.jsx';

const customerDetails = ( props ) => {
  const setAddress = (address) => {
    if (address) {
      let head = Helper.createTableHead(['Alias', 'Odbiorca', 'Miasto', 'Kod', 'Adres', 'Adres (cd.)', 'Firma', 'Telefon', 'Tel. kom.']);
      let list = address.map((el, index) => {
        return (
          <tr key={index} class="textAlignCenter">
            <td>{el.alias}</td>
            <td>{el.firstname} {el.lastname}</td>
            <td>{el.city}</td>
            <td>{el.postcode}</td>
            <td>{el.address1}</td>
            <td>{el.address2}</td>
            <td>{el.company}</td>
            <td>{el.phone}</td>
            <td>{el.phone_mobile}</td>
          </tr>
        );
      });
      let title = message.customer.addresses;
      return Helper.setTable(title, head, list);
    } else {
      return (
        <div class="col-xs-12">
          <h4>{message.customer.noAddress}</h4>
        </div>
      );
    }
  };
  const setContent = (address, order, panel) => {
    return (
      <div class="col-xs-12 pull-left marginTop20px">
        <div class="col-xs-12">
          <h3>{message.customer.detailsIndicator} - {message.customer.panels[panel]}: </h3>
          <div class="col-xs-12">
            {address}
            {order}
          </div>
        </div>
      </div>
    );
  };
  const setDisplay = (notEmpty, address, order, panel) => {
    let curAddress, curOrder;
    if (notEmpty[panel]) {
      curAddress = null;
      if (address[panel].length > 0) {
        curAddress = setAddress(address[panel]);
      }
      curOrder = null;
      if (order[panel].length > 0) {
        curOrder = setOrder(order[panel]);
      }
      return setContent(curAddress, curOrder, panel);
    } else {
      return setEmpty(panel);
    }
  };
  const setEmpty = (panel) => {
    return (
      <div class="col-xs-12">
        <h3>{message.customer.noAccount[panel]}</h3>
      </div>
    );
  };
  const setName = (data) => {
    let name;
    if (data.gender) {
      name = data.gender + ' ';
    }
    name += data.firstname + ' ' + data.lastname;
    return name;
  };
  const setOrder = (order) => {
    if (order) {
      let head = Helper.createTableHead(['ID', 'Referencja', 'Data', 'Kwota (produkty)', 'Kwota (porto)']);
      let list = order.map((el, index) => {
        return (
          <tr key={index} class="textAlignCenter">
            <td>{el.id}</td>
            <td>{el.reference}</td>
            <td>{el.dateAdd}</td>
            <td>{el.totalProduct}{message.currency}</td>
            <td>{el.totalShipping}{message.currency}</td>
          </tr>
        );
      });
      let title = message.customer.orders;
      return Helper.setTable(title, head, list);
    } else {
      return (
        <div class="col-xs-12">
          <h4>{message.customer.noOrder}</h4>
        </div>
      );
    }
  };
  let message = props.message;
  let address = props.data.address;
  let customer = props.data.customer;
  let order = props.data.orders;
  let notEmpty = {
    new: false,
    old: false
  };
  let content, curClass, email, name;
  let id = [];
  if (customer && customer.old) {
    notEmpty.old = Boolean(props.data.customer.old);
    email = customer.old.email;
    name = setName(customer.old);
    id.push(message.customer.panels.old + ' - ID: ' + customer.old.id_customer);
  }
  if (customer && customer.new) {
    notEmpty.new = Boolean(props.data.customer.new);
    email = customer.new.email;
    name = setName(customer.new);
    id.push(message.customer.panels.new + ' - ID: ' + customer.new.id_customer);
  }
  if (!props.address || props.empty) {
    curClass = "container bgrContent borderRadius10 marginTop40px paddingBottom20px";
    content = (
      <div class="col-xs-12">
        <div class="col-xs-12">
          <Title title={message.customer.typeAnAddress} />
        </div>
      </div>
    );
  } else {
    let contentNew, contentOld;
    let title = message.customer.details + email + ' - ' + name;
    let idLabel = id.map((el, index) => {
      let curRow = (
        <div key={index} class="col-xs-12 marginTop10px">
          <Label
            name={el}
          />
        </div>
      );
      return curRow;
    });
    let goBackUrl = props.url.path + props.url.pathSuffix + 'customers';
    let showMailUrl = props.url.serverPath + 'customer/mail/' + props.token + '?email=' + props.address + '&result=display';
    let buttons = (
      <div class="marginTop10px">
        <div class="col-xs-12 col-md-2 pull-left">
          <a href={goBackUrl} class="form-control btn btn-warning" disabled={props.disable}>{message.goBack}</a>
        </div>
        <Href
          link={showMailUrl}
          classMain="col-xs-12 col-md-3 col-lg-2 pull-left"
          className="form-control btn btn-primary"
          content={message.orders.showEmail}
        />
        <div class="col-xs-12 col-md-2">
          <input class="form-control btn btn-primary cursorPointer" type="button" disabled={props.disable} value={message.customer.mailDetails} onClick={ () => props.send('send') } />
        </div>
        <div class="col-xs-12 col-md-2">
          <input class="form-control btn btn-primary cursorPointer" type="button" disabled={props.disable} value={message.customer.mailTransfer} onClick={ () => props.send('transfer') } />
        </div>
        <div class="col-xs-12 col-md-2">
          <input class="form-control btn btn-danger cursorPointer" type="button" disabled={props.disable} value={message.customer.delete} onClick={ () => props.delete() } />
        </div>
      </div>
    );
    contentOld = setDisplay(notEmpty, address, order, 'old');
    contentNew = setDisplay(notEmpty, address, order, 'new');
    curClass = "container bgrContent borderRadius10 marginTop40px paddingBottom40px";
    content = (
      <div class="col-xs-12">
        <div class="col-xs-12">
          <Title title={title} />
          {idLabel}
          {contentOld}
          {contentNew}
          {buttons}
        </div>
      </div>
    );
  }
  return(
    <div class={curClass}>
      {content}
    </div>
  );
}

export default customerDetails;