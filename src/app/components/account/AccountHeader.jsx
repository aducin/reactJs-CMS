import React from 'react';
import DatePicker from 'react-datepicker';

import Label from '../dumb/Label.jsx';
import Select from '../dumb/Select.jsx';
import Title from '../dumb/Title.jsx';

const accountHeader = ( props ) => {
  let message = props.message;
  let stateOptions = props.states;
  let typeOptions = props.types;
  let xml;
  if (props.link) {
    xml = (
      <div class="col-xs-12 col-sm-4 col-md-12 marginTop10px">
        <a href={props.link} download>{message.account.downloadXml}</a>
      </div>
    );
  } else {
    xml = (
      <div class="col-xs-12 col-sm-4 col-md-12 marginTop10px">
        <input class="form-control btn btn-primary maxWidth160" disabled={!props.xml} onClick={ () => props.createXml() } type="button" value={ message.account.createXml } />
      </div>
    );
  }
  return(
    <div class="container bgrContent borderRadius10 marginTop40px paddingBottom40px">
      <div class="col-xs-12">
        <Title title={message.title.accounts} />
      </div>
      <div class="col-xs-12">
        <div class="col-xs-12">
          <div class="col-xs-12 col-md-8 pull-left">
            <h4>{ message.account.filter }</h4>
            <Select
              curClass="col-xs-12 marginTop10px"
              setDisabled={props.disable}
              list={ typeOptions }
              name="type"
              selectChange={ props.handleSelectChange.bind(this) }
              title={ message.account.type }
              value={ props.selected.type }
            />
            <Select
              curClass="col-xs-12 marginTop10px"
              setDisabled={props.disable}
              list={ stateOptions }
              name="state"
              selectChange={ props.handleSelectChange.bind(this) }
              title={ message.account.state }
              value={ props.selected.state }
            />
            <div class="col-xs-12 marginTop10px"></div>
            <Label name={ message.account.dateFrom } />
            <div class="col-xs-12 col-lg-6">
              <DatePicker
                dateFormat="YYYY.MM.DD"
                selected={props.selected.dateFrom}
                onChange={props.dateChangeHandler.bind(this, 'dateFrom')}
                locale="pl-pl"
                className="centered form-control"
                todayButton={ message.today }
              />
            </div>
            <div class="col-xs-12 marginTop10px"></div>
            <Label name={ message.account.dateTo } />
            <div class="col-xs-12 col-lg-6">
              <DatePicker
                dateFormat="YYYY.MM.DD"
                selected={props.selected.dateTo}
                onChange={props.dateChangeHandler.bind(this, 'dateTo')}
                locale="pl-pl"
                className="centered form-control"
                todayButton={ message.today }
              />
            </div>
          </div>
          <div class="col-xs-12 col-md-4 pull-left">
            <h4>{message.account.managing}</h4>
            <div class="col-xs-12 col-sm-4 col-md-12 marginTop10px">
              <input class="form-control btn btn-primary maxWidth160" disabled={props.disable} onClick={ () => props.accountModal('add') } type="button" value={ message.account.add } />
            </div>
            <div class="col-xs-12 col-sm-4 col-md-12 marginTop10px">
              <input class="form-control btn btn-primary maxWidth160" disabled={props.disable || !props.selectedRow} onClick={ () => props.accountModal('modify') } type="button" value={ message.account.modify } />
            </div>
            {xml}
          </div>
        </div>
      </div>
    </div>
  );
}

export default accountHeader;