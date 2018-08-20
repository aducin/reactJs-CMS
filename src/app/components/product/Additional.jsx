import React from 'react';

import Config from '../../Config';
import Modified from './container/Modified.jsx';
import LastOrders from './container/LastOrders.jsx';
import Printings from './container/Printings.jsx';
import productModelInstance from '../../model/productModel';

const additional = ( props ) => {
  const model = productModelInstance();
  const product = props.product;
  let lastOrders, printings;
  if (model.token) {
    lastOrders = (
      <LastOrders
        data={ product.lastOrders }
        search={ product.ordersSearch }
      />
    );
    printings = (
      <Printings
        data={ product.printings }
        handle={ (data) => props.print(data) }
      />
    );
  }
  return(
    <div>
      <Modified
        after={ () => props.mods() }
        list={ product.modifiedList }
        search={ props.search }
      />
      { lastOrders }
      { printings }
    </div>
  );
};

export default additional;
