import React from 'react';

import 'font-awesome/css/font-awesome.min.css';

import { sortList } from '../../functions/sort';
import { setDetailsContent, setIcon, setSummary, setTaxRow } from '../../functions/jsx/account.jsx';

import Config from '../../Config';
import Title from '../dumb/Title.jsx';

const accountDetail = ( props ) => {
  if (props.empty) {
    return <Title title={Config.message.account.noData} />;
  } else {
    let content, head, summary, row3, row17;
    let list = props.data.list.map((el) => {
      let curType = Config.accountTypes.filter((secondEl) => { return parseInt(secondEl.id) === parseInt(el.type); });
      if (curType[0]) {
        el.typeName = curType[0].name;
      }
      return el;
    });
    list = sortList([...list], props.sortBy);
    if (!props.ascending) {
      list.reverse();
    }
    let message = Config.message;
    let title = props.data.automatic ? message.account.automatic : message.account.notAutomatic[0] + list.length + ' ' + message.account.notAutomatic[1];
    if (!props.data.automatic && props.data.amount === props.data.maxAmount) {
      title += message.account.maxAmount;
    }
    let headArray = Config.accountColumns.map((el, index) => {
      if (el.value) {
        let icon = setIcon(el.value, props.sortBy, props.ascending);
        return (
          <th onClick={() => props.sortTable(el.value)} key={index} class="textAlignCenter cursorPointer">{el.name}<i class={icon} style={Config.leftMargin} aria-hidden="true"></i></th>
        );
      } else {
        return <th key={index} class="textAlignCenter">{el.name}</th>;
      }
    });
    head = (
      <thead>
        <tr>{headArray}</tr>
      </thead>
    );
    content = setDetailsContent(list, props.selectedRow, props.selectRow);
    let numbers = props.data.amounts;
    if (numbers.amount3 > 0) {
      row3 = setTaxRow(numbers.amount3, numbers.tax3, '3%');
    }
    if (numbers.amount17 > 0) {
      row17 = setTaxRow(numbers.amount17, numbers.tax17, '17%');
    }
    if (numbers.amount3 > 0 || numbers.amount17 > 0) {
      summary = setSummary(row3, row17);
    }
    return(
      <div class="col-xs-12 pull-left bgrContent borderRadius10 marginTop40px">
        <div class="col-xs-12">
          <Title title={title} />
        </div>
        <div class="marginTop20px">
          <table class="table table-striped table-bordered table-horizontal">
            {head}
            {content}
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