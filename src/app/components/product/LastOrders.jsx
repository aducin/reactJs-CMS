import React from 'react';

import Helper from '../../helper/Helper.jsx';

import Busy from '../dumb/Busy.jsx';
import Title from '../dumb/Title.jsx';

const LastOrders = ( props ) => {
  let modifyOrder = (current, id) => {
    props.setLastOrder(current, id);
  };
  let data = props.data || {};
  let text = props.message;
  const styles = {
    padding15px: {paddingTop: '15px'}
  };
  if (props.inSearch) {
    return (
      <Busy title={text.modifiedSearch} />
    );
  } else {
    let setTable = (current) => {
      let title = text.orders.newOrder[current];
      let head = Helper.createTableHead(['ID', 'Data', 'Symbol', 'Kwota', 'Porto', 'Akcja']);
      let list = data.list[current].map((el, index) => {
        let linkPath = '#/orders/' + current + '/' + data.newest.old;
        return (
          <tr key={ index } class="textCentered">
            <td style={styles.padding15px}><a href={linkPath} target="blank">{el.id}</a></td>
            <td style={styles.padding15px}>{el.dateAdd}</td>
            <td style={styles.padding15px}>{el.reference}</td>
            <td style={styles.padding15px}>{el.totalProduct}{text.currency}</td>
            <td style={styles.padding15px}>{el.totalShipping}{text.currency}</td>
            <td><input class="form-control btn btn-primary" type="button" value={text.delete} onClick={ modifyOrder.bind(this, current, el.id) } /></td>
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