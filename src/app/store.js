import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineEpics } from 'redux-observable';

import * as account from './epics/accountEpic';
import * as order from './epics/orderEpics';
import * as postal from './epics/postalEpic';
import * as product from './epics/productEpics.js';
import * as productActions from './actions/productActions.jsx';

//import logger from "redux-logger";
//import promise from "redux-promise-middleware";
//import thunk from "redux-thunk";

import reducer from "./reducers/combineReducer.jsx";

const appEpic = combineEpics(
  account.getAccounts,
  order.setAdditional,
  order.setEvenOrder,
  order.setSingleOrder,
  order.setVoucher,
  order.voucherCustomer,
  postal.getData,
  product.getById,
  product.getHistory,
  product.getByName,
  productActions.setLastOrders
);

const epicMiddleware = createEpicMiddleware();

//const middleware = applyMiddleware(promise(), thunk, logger());
//const middleware = composeWithDevTools(applyMiddleware(promise(), thunk, logger()));
const middleware = composeWithDevTools(applyMiddleware(epicMiddleware));
const store = createStore(reducer, middleware);
epicMiddleware.run(appEpic);

export default store;





