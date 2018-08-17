import React from 'react';
import ReactTooltip from 'react-tooltip';

import Config from '../../../Config';
import Checkbox from '../../dumb/Checkbox.jsx';
import Label from '../../dumb/Label.jsx';

const cssPadding12 = { paddingBottom: 12, paddingTop: 12 };

const categories = ( props ) => {
  let product = props.product;
  let categories;
  let categoryLength = Config.message.categoryAmount + product.productCategories.length;
  let categoryContent = (
    <div>
      <Label heightRow="3" name={Config.message.categories} cssStyle={ cssPadding12 } />
      <div class="col-xs-12 col-lg-9">
        <div class="col-xs-12">
          <p data-tip={Config.message.actions.showList} style={ cssPadding12 }><i>{categoryLength}</i></p>
          <ReactTooltip />
        </div>
      </div>
    </div>
  );
  if (props.display) {
    categoryContent = (
      <Checkbox
        onHandleChange={ props.checkAct.bind(this) }
        active={ product.productCategories }
        categories={ product.categories }
        cssStyle={ cssPadding12 }
        name="category"
        title={Config.message.labels.categories}
        toggle={ props.action.bind(this) }

      />
    );
    categories = <div id="category">{categoryContent}</div>;
  } else {
    categories = <div id="category" onClick={ props.action.bind(this, 'category') }>{categoryContent}</div>;
  }
  return categories;
};

export default categories;
