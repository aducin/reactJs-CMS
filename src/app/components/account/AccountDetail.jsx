import React from 'react';

import 'font-awesome/css/font-awesome.min.css';

import Title from '../dumb/Title.jsx';

const leftMargin = {marginLeft: '20px'};

const accountDetail = ( props ) => {
  if (props.empty) {
    return (
      <Title title={props.message.account.noData} />
    )
  } else {
    let field = props.sortBy;
    const sortFn = (a, b) => {
      if (a[field] === null) {
        return -1;
      } else {
        if (typeof(a[field]) === 'string') {
          var nameA = a[field].toLowerCase().localeCompare(b[field].toLowerCase(), "pl-PL");
          var nameB = b[field].toLowerCase().localeCompare(a[field].toLowerCase(), "pl-PL");
          if (nameA < nameB)
            return -1
          if (nameA > nameB)
            return 1
          return 0;
        } else if (typeof(a[field]) === 'number') {
          return a[field] - b[field];
        }
      }
    };
    let content, head, summary, row3, row17, tax3, tax17;
    let amount3 = 0;
    let amount17 = 0;
    let contentArray = [];
    let list = props.data.list.map((el) => {
      let curType = props.types.filter((secondEl) => { return parseInt(secondEl.id) === parseInt(el.type); });
      if (curType[0]) {
        el.typeName = curType[0].name;
      }
      return el;
    });
    list.sort(sortFn);
    if (!props.ascending) list.reverse();
    let message = props.message;
    let title = props.data.automatic ? message.account.automatic : message.account.notAutomatic[0] + list.length + ' ' + message.account.notAutomatic[1];
    if (!props.data.automatic && props.data.amount === props.data.maxAmount) {
      title += message.account.maxAmount;
    }
    let headArray = props.columns.map((el, index) => {
      if (el.value) {
        let icon;
        if (el.value !== field) {
          icon = 'fa fa-sort';
        } else {
          if (props.ascending) {
            icon = 'fa fa-sort-desc';
          } else {
            icon = 'fa fa-sort-asc';
          }
        }
        return (
          <th onClick={() => props.sortTable(el.value, el.sort)} key={index} class="textAlignCenter cursorPointer">{el.name}<i class={icon} style={leftMargin} aria-hidden="true"></i></th>
        );
      } else {
        return (
          <th key={index} class="textAlignCenter">{el.name}</th>
        );
      }
    });
    list.forEach((el, index) => {
      if (el.closed) {
        if (el.type === 3) {
          amount17 += el.floatAmount;
        } else if (el.type !== 4) {
          amount3 += el.floatAmount;
        } else {
          amount3 = amount3 - el.floatAmount;
        }
      }
      let active = el.id === props.selectedRow;
      let activeClass = active ? 'selected cursorPointer textAlignCenter' : 'cursorPointer textAlignCenter';
      let closedClass = el.closed ? 'colorWarning' : 'colorSuccess';
      contentArray.push(
        <tr key={ index } onClick={ () => props.selectRow(el.id)} class={activeClass}>
          <td class={closedClass}>{index + 1}.</td>
          <td>{el.recipient}</td>
          <td>{el.address}</td>
          <td>{el.amount}{message.currency}</td>
          <td>{el.typeName}</td>
          <td>{el.receipt}</td>
          <td>{el.receiptTime}</td>
          <td>{el.cashTime}</td>
          <td>{el.locs}</td>
          <td>{el.coach}</td>
          <td>{el.element}</td>
          <td>{el.accessories}</td>
          <td>{el.book}</td>
          <td>{el.car}</td>
        </tr>
      );
    });
    if (amount3 > 0) {
      tax3 = amount3 * 0.03;
      row3 = (
        <tr>
          <td key="1" class="textAlignCenter">3%</td>
          <td key="2" class="textAlignCenter">{ amount3.toFixed(2) }{ message.currency }</td>
          <td key="3" class="textAlignCenter">{ tax3.toFixed(2) }{ message.currency }</td>
        </tr>
      );
    }
    if (amount17 > 0) {
      tax17 = amount17 * 0.17;
      row17 = (
        <tr>
          <td key="1" class="textAlignCenter">17%</td>
          <td key="2" class="textAlignCenter">{ amount17.toFixed(2) }{ message.currency }</td>
          <td key="3" class="textAlignCenter">{ tax17.toFixed(2) }{ message.currency }</td>
        </tr>
      );
    }
    if (amount3 > 0 || amount17 > 0) {
      summary = (
        <div class="col-xs-12 col-md-4 pull-left">
          <table class="table table-striped table-bordered">
            <thead>
            <tr>
              <th key="1" class="textAlignCenter">{ message.account.summary }</th>
              <th key="2" class="textAlignCenter">{ message.account.summaryAmount }</th>
              <th key="3" class="textAlignCenter">{ message.account.summaryTax }</th>
            </tr>
            </thead>
            <tbody>
            { row3 }
            { row17 }
            </tbody>
          </table>
        </div>
      );
    }
    head = (
      <thead>
      <tr>
        {headArray}
      </tr>
      </thead>
    );
    content = (
      <tbody>
      { contentArray }
      </tbody>
    );
    return(
      <div class="col-xs-12 pull-left bgrContent borderRadius10 marginTop40px paddingBottom40px">
        <div class="col-xs-12">
          <Title title={title} />
        </div>
        <div class="marginTop20px">
          <table class="table table-striped table-bordered">
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
}

export default accountDetail;