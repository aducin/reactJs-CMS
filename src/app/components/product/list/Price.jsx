import React from 'react';

import Config from '../../../Config';

const price = ( props ) => {
  let type = props.type;
  let discount = props.discount;
  let curPrice = props.price;
  let price;
  if (!discount[type]) {
    price = (
      <div>
        <p class="textCentered marginTop40px">{curPrice[type]}{Config.message.currency}</p>
      </div>
    );
  } else {
    let reduction = discount[type].reduction;
    let finalReduction;
    let finalPrice;
    if (discount[type].reductionType === 'amount') {
      finalReduction = reduction + Config.message.currency;
      finalPrice = (curPrice[type] - parseFloat(reduction)).toFixed(2);
    } else {
      finalReduction = parseFloat(reduction) * 100 + '%';
      let amount = curPrice[type] * reduction;
      finalPrice = (curPrice[type] - amount).toFixed(2);
    }
    price = (
      <div>
        <p class="textCentered marginTop20px">{finalPrice}zł</p>
        <p class="textCentered marginTop10px colorWarning">UWAGA! Rabat {finalReduction}</p>
      </div>
    );
  }
  return price;
};

export default price;
