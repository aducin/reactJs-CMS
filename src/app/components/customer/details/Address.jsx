import React from 'react';

import Config from '../../../Config';
import Helper from '../../../helper/Helper.jsx';

const address = (props) => {
  if (props.address) {
    let head = Helper.createTableHead(['Alias', 'Odbiorca', 'Miasto', 'Kod', 'Adres', 'Adres (cd.)', 'Firma', 'Telefon', 'Tel. kom.']);
    let list = props.address.map((el, index) => {
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
    let title = Config.message.customer.addresses;
    return Helper.setTable(title, head, list);
  } else {
    return (
      <div class="col-xs-12">
        <h4>{Config.message.customer.noAddress}</h4>
      </div>
    );
  }
};

export default address;
