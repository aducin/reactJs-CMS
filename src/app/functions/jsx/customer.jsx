import React from 'react';

import Label from '../../components/dumb/Label.jsx';
import Title from '../../components/dumb/Title.jsx';

export const setIdLabel = (id) => {
  return id.map((el, index) => {
    let curRow = (
      <div key={index} class="col-xs-12 marginTop10px">
        <Label name={el} />
      </div>
    );
    return curRow;
  });
};

export const setContent = (header, message, customerHeader, busy, customerDetails, modal) => {
  return(
    <div>
      {header}
      {message}
      {customerHeader}
      {busy}
      {customerDetails}
      {modal}
    </div>
  );
};

export const setDetailContent = (title, idLabel, contentOld, contentNew, buttons) => {
  return(
    <div class="container bgrContent borderRadius10 marginTop40px paddingBottom40px">
      <div class="col-xs-12">
        <div class="col-xs-12">
          <Title title={title} />
          {idLabel}
          {contentOld}
          {contentNew}
          {buttons}
        </div>
      </div>
    </div>
  );
};
