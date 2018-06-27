import { combineReducers } from 'redux';

import { accountReducer } from './accountReducer.jsx';
import { customerReducer } from './customerReducer.jsx';
import { orderReducer } from './orderReducer.jsx';
import { postalReducer } from './postalReducer.jsx';
import { productReducer } from './productReducer.jsx';
import { userReducer } from './userReducer.jsx';

export default combineReducers({
	account: accountReducer,
	customer: customerReducer,
	order: orderReducer,
	postal: postalReducer,
	product: productReducer,
	user: userReducer,
});
