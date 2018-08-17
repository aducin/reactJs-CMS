import React from 'react';
import ReactTooltip from 'react-tooltip';

import Config from '../../Config';
import TableContent from '../../components/order/detail/TableContent.jsx';
import Title from '../../components/dumb/Title.jsx';

export const setContainer = (header, message, orderHeader, busy, details) => {
  return (
    <div>
      {header}
      {message}
      {orderHeader}
      {busy}
      {details}
    </div>
  )
};

export const setTableContent = (name, data, action) => {
  let contentArray = [];
  data.forEach((el, index) => {
    contentArray.push(
      <TableContent key={index} el={el} index={index} name={name} action={action} />
    );
  });
  return contentArray;
};

export const setContent = (title, details, tableHeaders, contentArray, summary, buttons, buttonsSecondLine, displayImg) => {
  return(
    <div class="container bgrContent paddingBottom2 marginTop2 borderRadius10">
      <div class="marginTop20px">
        <Title title={title} />
      </div>
      {details}
      <div class="col-xs-12 pull-left">
        <div class="marginTop20px">
          <table class="table table-striped table-bordered">
            <thead>
            {tableHeaders}
            </thead>
            <tbody>
            {contentArray}
            </tbody>
          </table>
          {summary}
        </div>
        {buttons}
        {buttonsSecondLine}
      </div>
      {displayImg}
      <ReactTooltip />
    </div>
  );
};

