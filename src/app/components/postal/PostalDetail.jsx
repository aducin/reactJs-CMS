import React from 'react';

import Title from '../dumb/Title.jsx';

const postalDetail = ( props ) => {
  let list = props.list;
  let message = props.message;
  let tableHeaders = (
    <tr>
      <th class="col-xs-1 textAlignCenter">LP.</th>
      <th class="col-xs-4 textAlignCenter">Kwota</th>
      <th class="col-xs-6 textAlignCenter">Data</th>
    </tr>
  );
  let contentArray = [];
  list.forEach((el, index) => {
    contentArray.push(
      <tr key={index} class="textAlignCenter">
        <td class="col-xs-1">{el.number}.</td>
        <td class="col-xs-4">{el.current}{message.currency}</td>
        <td class="col-xs-6">{el.date}</td>
      </tr>
    );
  });
  return(
    <div class="container bgrContent borderRadius10 marginTop40px paddingBottom40px">
      <div class="col-xs-12">
        <Title title={message.postal.history} />
      </div>
      <div class="container">
        <div class="col-xs-12">
          <table class="table table-striped table-bordered">
            <thead>
            {tableHeaders}
            </thead>
            <tbody>
            {contentArray}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default postalDetail;