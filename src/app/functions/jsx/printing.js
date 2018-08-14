import React from 'react';

import Config from '../../Config';
import Helper from '../../helper/Helper.jsx';

export const setContent = (inputs, modal, table) => {
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

export const setEmpty = (text, inputs, modal) => {
  return (
    <div class="container">
      <div class="col-xs-12 col-md-10">
        <h3>{text.noPrintings}</h3>
      </div>
      <div class="col-xs-12 col-md-2 marginTop15px paddingBottomResp">
        {inputs}
        {modal}
      </div>
    </div>
  )
};

const setList = (data, deleteHandler, outThis) => {
  return data.map((el, index) => {
    let linkPath = Config.url.filePath + 'printing/' + el.id + '/' + el.name;
    return (
      <tr key={ index } class="textCentered">
        <td style={Config.padding15px}>{index + 1}</td>
        <td style={Config.padding15px}><a href={linkPath} target="blank">{el.name}</a></td>
        <td style={Config.padding15px}>{el.description}</td>
        <td style={Config.padding15px}>{el.createdTime}</td>
        <td>
          <div class="col-xs-6 pull-left marginTop7px">
            <a href={linkPath} download>
              <i class="fa fa-download" aria-hidden="true"></i>
            </a>
          </div>
          <div class="col-xs-6 pull-left marginTop7px">
            <i onClick={ deleteHandler.bind(outThis, el.id) } class="fa fa-trash cursorPointer" aria-hidden="true"></i>
          </div>
        </td>
      </tr>
    )
  });
};

export const setTable = (data, deleteHandler, outThis, inputs, modal) => {
  let head = Helper.createTableHead(['Lp.', 'Nazwa', 'Opis', 'Data', 'Akcja']);
  let list = setList(data, deleteHandler, outThis);
  let table = Helper.setTable(Config.message.labels.printings, head, list);
  return setContent(inputs, modal, table);
};
