import React from 'react';

export const setContent = (header, message, productHeader, basic, edition, history, nameList, modified, lastOrders, print) => {
  return (
    <div class="paddingBottom2">
      {header}
      {message}
      {productHeader}
      {basic}
      {edition}
      {history}
      {nameList}
      {modified}
      {lastOrders}
      {print}
    </div>
  )
};
