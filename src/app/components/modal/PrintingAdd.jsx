import React from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'react-bootstrap';

import Config from '../../Config';
import Input from '../dumb/Input.jsx';
import Label from '../dumb/Label.jsx';

const marginTop = { marginTop: '-3px' };

const printingAdd = ( props ) => {
  let bodyHeight = { height: '200px'};
  let text = Config.message;
  let title = text.products.newPrinting;
  let titleClass;
  if (props.messageType) {
    titleClass = props.messageType === 'success' ? 'colorSuccess' : 'colorWarning';
    title = props.messageContent;
  }
  return(
    <Modal show={ props.show !== false } onHide={ () => props.close() }>
      <Modal.Header closeButton>
        <Modal.Title class={titleClass}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={bodyHeight}>
        <div class="marginTop20px">
          <div class="col-xs-4 pull-left">
          <Label heightRow="12" name={text.labels.filename} />
          </div>
          <div class="col-xs-8 pull-right">
            <h4 style={marginTop}>{props.file}</h4>
          </div>
        </div>
        <div class="col-xs-12 marginTop20px">
          <Label heightRow="4" name={text.products.description} />
          <Input
            heightRow="8"
            placeholder={text.labels.description.placeholder}
            changeHandler={ (e) => props.descriptionChangeHandler(e) }
            name="description"
            value={props.description}
            disable={ props.disabled }
          />
        </div>
        <div class="col-xs-12 marginTop20px">
          <div class="col-xs-12 col-md-4 pull-right">
            <input
              class="form-control btn btn-primary pull-right"
              type="button"
              value={text.products.saveFile}
              onClick={ () => props.save() }
              disabled={ props.saveDisable } />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default printingAdd;