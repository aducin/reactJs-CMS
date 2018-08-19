import React from 'react';

const warning = ( props ) => {
  let data = props.data;
  let text = props.text;
  return (
    <div>
      <div class="col-xl-12 col-md-4 pull-left"></div>
      <div class="col-xl-12 col-md-8 pull-left colorWarning marginTop10px textAlignCenter">{text}<i>{data}</i></div>
    </div>
  );
};

export default warning;
