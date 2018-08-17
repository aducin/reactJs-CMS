import React from 'react';
import ReactTooltip from 'react-tooltip';

import Config from '../../Config';
import Price from '../../components/product/list/Price.jsx';
import Row from '../../components/product/list/Row.jsx';

const setContent = (list, modal) => {
  return list.map((el, index) => {
    let priceNew = <Price type="new" discount={el.discount} price={el.price} />;
    let priceOld = <Price type="old" discount={el.discount} price={el.price} />;
    return <Row key={index} el={el} priceNew={priceNew} priceOld={priceOld} modal={modal} />;
  });
};

export default setContent;
