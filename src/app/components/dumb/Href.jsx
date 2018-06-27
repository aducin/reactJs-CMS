import React from 'react';

const href = ( props ) => {
  return (
    <div class={props.classMain}>
      <a href={props.link} class={props.className} target="blank">{props.content}</a>
    </div>
  );
}

export default href;