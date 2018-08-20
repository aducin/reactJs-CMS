import React from 'react';

export const setContent = (header, message, productHeader, basic, edition, history, nameList, additional) => {
  return (
    <div class="paddingBottom2">
      {header}
      {message}
      {productHeader}
      {basic}
      {edition}
      {history}
      {nameList}
      {additional}
    </div>
  )
};
