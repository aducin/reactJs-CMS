import React from 'react';

import Config from '../../../Config';
import Helper from '../../../helper/Helper.jsx';

const order = (props) => {
  if (props.order) {
    let head = Helper.createTableHead(['ID', 'Referencja', 'Data', 'Kwota (produkty)', 'Kwota (porto)']);
    let list = props.order.map((el, index) => {
      return (
        <tr key={index} class="textAlignCenter">
          <td>{el.id}</td>
          <td>{el.reference}</td>
          <td>{el.dateAdd}</td>
          <td>{el.totalProduct}{Config.message.currency}</td>
          <td>{el.totalShipping}{Config.message.currency}</td>
        </tr>
      );
    });
    let title = Config.message.customer.orders;
    return Helper.setTable(title, head, list);
  } else {
    return (
      <div class="col-xs-12">
        <h4>{Config.message.customer.noOrder}</h4>
      </div>
    );
  }
};

export default order;
