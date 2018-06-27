import React from 'react';

import Title from '../dumb/Title.jsx';

const postalHeader = ( props ) => {
  let message = props.message;
  let content;
  if (props.amount) {
    content = (
      <div class="col-xs-12 marginTop20px textAlignCenter">
        <div class="col-xs-12 col-md-2 pull-left"></div>
        <div class="col-xs-12 col-md-4 pull-left">
          <h3>{props.message.postal.currentAmount}</h3>
        </div>
        <div class="col-xs-12 col-md-4 pull-left textAlignCenter">
          <h3>{props.amount}{props.message.currency}</h3>
        </div>
        <div class="col-xs-12 marginTop20px"></div>
        <div class="col-xs-12 col-md-2 pull-left"></div>
        <div class="col-xs-12 col-md-4 pull-left">
          <input class="form-control btn btn-primary cursorPointer" disabled={props.disable} type="button" value={props.message.postal.add} onClick={ () => props.openModal('add') } />
        </div>
        <div class="col-xs-12 col-md-4 pull-left">
          <input class="form-control btn btn-primary cursorPointer" disabled={props.disable} type="button" value={props.message.postal.subtract} onClick={ () => props.openModal('subtract') } />
        </div>
      </div>
    );
  }
  return(
    <div class="container bgrContent borderRadius10 marginTop40px paddingBottom40px">
      <div class="col-xs-12">
        <Title title={message.title.postal} />
      </div>
      {content}
    </div>
  );
}

export default postalHeader;