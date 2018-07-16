import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineEpics } from 'redux-observable';

import * as product from './actions/productActions.jsx';

//import logger from "redux-logger";
//import promise from "redux-promise-middleware";
//import thunk from "redux-thunk";

import reducer from "./reducers/combineReducer.jsx";

const productEpic = combineEpics(
  product.setLastOrders
);

const epicMiddleware = createEpicMiddleware();

//const middleware = applyMiddleware(promise(), thunk, logger());
//const middleware = composeWithDevTools(applyMiddleware(promise(), thunk, logger()));
const middleware = composeWithDevTools(applyMiddleware(epicMiddleware));
const store = createStore(reducer, middleware);
epicMiddleware.run(productEpic);

export default store;





