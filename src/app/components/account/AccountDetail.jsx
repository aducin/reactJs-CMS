import React from 'react';

import 'font-awesome/css/font-awesome.min.css';

import { setList } from '../../functions/account/detail/setList';

import Config from '../../Config';
import Content from './detail/Content.jsx';
import Header from './detail/Header.jsx';
import Summary from './detail/Summary.jsx';
import TaxRow from './detail/TaxRow.jsx';
import Title from '../dumb/Title.jsx';

const accountDetail = ( props ) => {
  if (props.empty) {
    return <Title title={Config.message.account.noData} />;
  } else {
    let summary, row3, row17;
    let message = Config.message;
    let list = setList(props.data.list, props.ascending, props.sortBy);
    let title = props.data.automatic ? message.account.automatic : message.account.notAutomatic[0] + list.length + ' ' + message.account.notAutomatic[1];
    if (!props.data.automatic && props.data.amount === props.data.maxAmount) {
      title += message.account.maxAmount;
    }
    let numbers = props.data.amounts;
    if (numbers.amount3 > 0) {
      row3 = <TaxRow amount={numbers.amount3} tax={numbers.tax3} percent="3%" />;
    }
    if (numbers.amount17 > 0) {
      row17 = <TaxRow amount={numbers.amount17} tax={numbers.tax17} percent="17%" />;
    }
    if (numbers.amount3 > 0 || numbers.amount17 > 0) {
      summary = <Summary row3={row3} row17={row17} />;
    }
    return(
      <div class="col-xs-12 pull-left bgrContent borderRadius10 marginTop40px">
        <div class="col-xs-12">
          <Title title={title} />
        </div>
        <div class="marginTop20px">
          <table class="table table-striped table-bordered table-horizontal">
            <Header action={props.sortTable} ascending={props.ascending} sortBy={props.sortBy} />
            <Content list={list} selectedRow={props.selectedRow} selectRow={props.selectRow} />
          </table>
          <div class="col-xs-12 col-md-4 pull-left"></div>
          {summary}
          <div class="col-xs-12 col-md-4 pull-left"></div>
        </div>
      </div>
    );
  }
};

export default accountDetail;
