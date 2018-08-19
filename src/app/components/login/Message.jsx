import React from 'react';

const message = (props) => {
  return(
    <div class={props.style}>
      <p>{props.message}</p>
    </div>
  );
};

export default message;
