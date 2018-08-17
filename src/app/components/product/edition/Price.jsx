import React from 'react';

import Config from '../../../Config';
import Input from '../../dumb/Input.jsx';
import Label from '../../dumb/Label.jsx';
import Warning from '../../dumb/Warning.jsx';

const price = ( props ) => {
  let message = Config.message;
  let product = props.product;
  let type = props.type;
  let price = {};
  price.new = product.price !== undefined ? parseFloat(product.price.new) : null;
  price.old = product.price !== undefined ? parseFloat(product.price.old) : null;
  let discount = { new: false, old: false };
  let realDiscount = { new: null, old: null };
  let warning = { new: null, old: null };
  if (product.priceReal !== undefined) {
    if (product.priceReal.new && product.priceReal.new !== product.price.new) {
      discount.new = true;
      var currentDiscount = product.discount.new;
      let discountType = currentDiscount.reductionType;
      if (discountType === "percentage") {
        let currentAmount = currentDiscount.reduction * 100;
        realDiscount.new = currentAmount + '%';
      } else if (discountType === "amount") {
        realDiscount.new = currentDiscount.reduction + message.currency;
      }
    }
    if (product.priceReal.old && product.priceReal.old !== product.price.old) {
      discount.old = true;
      var currentDiscount = product.discount.old;
      let discountType = currentDiscount.reductionType;
      if (discountType === "percentage") {
        let currentAmount = currentDiscount.reduction * 100;
        realDiscount.old = currentAmount + '%';
      } else if (discountType === "amount") {
        realDiscount.old = currentDiscount.reduction + ' zł';
      }
    }
  }
  if (discount[type]) {
    let information = product.priceReal[type] + message.currency + message.realPrice.suffix + realDiscount[type];
    warning[type] = (
      <Warning
        firstRow="marginTop20px"
        header={message.realPrice[type]}
        message={ information }
        currentStyle={Config.css.centered}
        secondRow="col-xs-12 col-sm-9 col-lg-6"
      />
    );
  }
  let curName, curType;
  if (type === 'new') {
    curName = 'nameNew';
    curType = "priceNew";
  } else {
    curName = 'nameOld';
    curType = "priceOld";
  }
  return(
    <div>
      <Label name={message.labels.price[curName]} />
      <Input
        placeholder={message.labels.price.placeholder}
        changeHandler={ props.action.bind(this) }
        name={curType}
        disable={props.disabled}
        value={price[type].toFixed(2)}
      />
      {warning[type]}
    </div>
  );
};

export default price;
