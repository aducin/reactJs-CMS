import React from 'react';

import Buttons from './details/Buttons.jsx';
import Config from '../../Config';
import Content from './details/Content.jsx';
import Empty from './details/Empty.jsx';
import Label from '../dumb/Label.jsx';
import { setDetailContent, setIdLabel } from '../../functions/jsx/customer.jsx';
import { setId } from '../../functions/customer/setId';
import { setName } from '../../functions/customer/setName';
import Title from '../dumb/Title.jsx';

const customerDetails = ( props ) => {
  const message = Config.message;
  let address = props.data.address;
  let customer = props.data.customer;
  let notEmpty = { new: false, old: false };
  let email, name;
  if (customer && customer.old) {
    notEmpty.old = Boolean(props.data.customer.old);
    email = customer.old.email;
    name = setName(customer.old);
  }
  if (customer && customer.new) {
    notEmpty.new = Boolean(props.data.customer.new);
    email = customer.new.email;
    name = setName(customer.new);
  }
  if (!props.address || props.empty) {
    return <Empty />;
  } else {
    let idLabel = setIdLabel(setId(customer));
    let buttons = (
      <Buttons
        address={props.address}
        delete={props.delete}
        disabled={props.disable}
        send={props.send}
        token={props.token}
      />
    );
    let contentOld = <Content address={address} notEmpty={notEmpty} order={props.data.orders} panel={'old'} />;
    let contentNew = <Content address={address} notEmpty={notEmpty} order={props.data.orders} panel={'new'} />;
    let title = message.customer.details + email + ' - ' + name;
    return setDetailContent(title, idLabel, contentOld, contentNew, buttons);
  }
};

export default customerDetails;
