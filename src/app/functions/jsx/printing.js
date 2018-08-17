import React from 'react';

import Config from '../../Config';
import Helper from '../../helper/Helper.jsx';
import Row from '../../components/product/printing/Row.jsx';

const setContent = (inputs, modal, table) => {
  return (
    <div class="container bgrContent paddingBottom2 marginTop2 borderRadius10">
      <div class="col-xs-12 col-md-2 marginTop15px">
        {inputs}
        {modal}
      </div>
      {table}
    </div>
  );
};

const setTable = (data, deleteHandler, inputs, modal) => {
  let head = Helper.createTableHead(['Lp.', 'Nazwa', 'Opis', 'Data', 'Akcja']);
  let list = <Row data={data} deleteHandler={deleteHandler} />;
  let table = Helper.setTable(Config.message.labels.printings, head, list);
  return setContent(inputs, modal, table);
};

export default setTable;
