import React from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'react-bootstrap';

const customerDelete = ( props ) => {
  let bodyHeight = { height: '65px'};
  return(
    <Modal show={ props.show !== false } onHide={ () => props.close() }>
      <Modal.Header closeButton>
        <Modal.Title>{props.message.customer.deleteConfirm}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={bodyHeight}>
        <div class="col-xs-12 col-md-4 pull-right">
          <input class="form-control btn btn-primary pull-right" type="button" value={props.message.no} onClick={ () => props.close() } />
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default customerDelete;