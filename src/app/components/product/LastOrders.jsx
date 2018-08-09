import React from 'react';

import mainModelInstance from '../../model/mainModel';
import productModelInstance from '../../model/productModel';
import Config from '../../Config';
import Helper from '../../helper/Helper.jsx';
import Busy from '../dumb/Busy.jsx';
import Title from '../dumb/Title.jsx';

const LastOrders = ( props ) => {
  const modifyOrder = (base, id) => {
    productModelInstance.modifyLastOrder(base, id, props.token)
      .then((response) => {
        if (response.data.success) {
          mainModelInstance.setMessage('success', response.data.reason);
          productModelInstance.refreshOrders();
        } else {
          throw new Error(response.data.reason);
        }
      })
      .catch((err) => mainModelInstance.setMessage('warning', err.message));
  };
  let data = props.data || {};
  let text = Config.message;
  const styles = {
    padding15px: {paddingTop: '15px'}
  };
  if (props.search) {
    return (
      <Busy title={text.modifiedSearch} />
    );
  } else {
    let setTable = (current) => {
      let title = text.orders.newOrder[current];
      let head = Helper.createTableHead(['ID', 'Data', 'Symbol', 'Kwota', 'Porto', 'Akcja']);
      let list = data.list[current].map((el, index) => {
        let linkPath = '#/orders/' + current + '/' + data.newest[current];
        return (
          <tr key={ index } class="textCentered">
            <td style={styles.padding15px}><a href={linkPath} target="blank">{el.id}</a></td>
            <td style={styles.padding15px}>{el.dateAdd}</td>
            <td style={styles.padding15px}>{el.reference}</td>
            <td style={styles.padding15px}>{el.totalProduct}{text.currency}</td>
            <td style={styles.padding15px}>{el.totalShipping}{text.currency}</td>
            <td><input class="form-control btn btn-primary" type="button" value={text.delete} onClick={ () => modifyOrder(current, el.id) } /></td>
          </tr>
        )
      });
      return Helper.setTable(title, head, list);
    };
    if (data.newest && (data.newest.new || data.newest.old)) {
      let tableNew, tableOld;
      if (data.newest.new) {
        tableNew = setTable('new');
      }
      if (data.newest.old) {
        tableOld = setTable('old');
      }
      return (
        <div class="container bgrContent paddingBottom2 marginTop2 borderRadius10">
          {tableNew}
          {tableOld}
        </div>
      );
    } else {
      return (
        <Title title={text.noLastOrder} />
      )
    }
  }
}

export default LastOrders;