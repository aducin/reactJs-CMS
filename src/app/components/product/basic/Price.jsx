import React from 'react';

import { checkWarning } from '../../../functions/product/basicModal/checkWarning';
import Config from '../../../Config';
import Input from '../../dumb/Input.jsx';
import Label from '../../dumb/Label.jsx';
import Warning from '../../product/basic/Warning.jsx';

const price = ( props ) => {
  let disabledPrice, discountNew, discountOld, priceMessage, priceNet;
  let data = props.data;
  let state = props.state;
  let text = Config.message;
  let priceNew = parseFloat(data.price.new);
  let priceOld = parseFloat(data.price.old);
  if (data.discount.new || data.discount.old) {
    if (data.discount.new) {
      let curDiscount = parseFloat(data.price.new) * parseFloat(data.discount.new.reduction);
      priceNew = parseFloat(priceNew - curDiscount);
      priceNet = <Warning text={text.discountNet + data.price.new + text.currency} />;
      discountNew = <Warning text={text.discount.new + curDiscount + '%'} />;
    }
    if (data.discount.old) {
      priceOld = parseFloat(data.price.old - data.discount.old.reduction);
      priceNet = <Warning text={text.discountNet + data.price.old + text.currency} />;
      discountOld = <Warning text={text.discount.old + data.discount.old.reduction + text.currency} />;
    }
    priceMessage = <Warning text={text.priceDisabled} />;
    disabledPrice = true;
  }
  let priceBorder = checkWarning(state, 'price', 'borderWarning');
  let priceError = checkWarning(state, 'price', 'classWarning');
  let finalText = text.differentPrices + priceNew.toFixed(2) + text.currency;
  let priceWarning = priceNew !== priceOld ? <Warning text={finalText} /> : null;
  return (
    <div>
      <Label labelClass={priceError} heightRow="4" name="Cena:" />
      <Input additionalClass={priceBorder} heightRow="8" placeholder="Podaj cenę" changeHandler={ (e) => this.inputChange(e) } name="price" value={priceOld.toFixed(2)} disable={ disabledPrice }/>
      {priceWarning}
      {priceNet}
      {discountOld}
      {discountNew}
      {priceMessage}
    </div>
  );
};

export default price;
