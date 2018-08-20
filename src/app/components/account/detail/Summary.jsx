import React from 'react';

import Config from '../../../Config';

const summary = ( props ) => {
  return (
    <div class="col-xs-12 col-md-4 pull-left">
      <table class="table table-striped table-bordered">
        <thead>
        <tr>
          <th key="1" class="textAlignCenter">{ Config.message.account.summary }</th>
          <th key="2" class="textAlignCenter">{ Config.message.account.summaryAmount }</th>
          <th key="3" class="textAlignCenter">{ Config.message.account.summaryTax }</th>
        </tr>
        </thead>
        <tbody>
        { props.row3 }
        { props.row17 }
        </tbody>
      </table>
    </div>
  );
};

export default summary;
