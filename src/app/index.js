import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import axios from 'axios';

import store from './store';

import Main from './containers/Main.jsx';
import LoginComponent from './components/login/loginComponent.jsx';

import 'bootstrap/dist/css/bootstrap.css';
import 'react-datepicker/dist/react-datepicker.css';
import '../assets/scss/style.scss';

const app = document.getElementById('app');

const componentRoutes = {
	component: Main,
	path: '/',
	indexRoute: { component: LoginComponent},
	childRoutes: [
		{
			path: '/customers',
			getComponent(location, cb) {
				System.import('./containers/Customer.jsx')
					.then(module => cb(null, module.default));
			}
		},
		{
			path: '/customers/:email',
			getComponent(location, cb) {
				System.import('./containers/Customer.jsx')
					.then(module => cb(null, module.default));
			}
		},
		{
			path: '/orders',
			getComponent(location, cb) {
				System.import('./containers/Order.jsx')
				.then(module => cb(null, module.default));
			}
		},
		{
			path: '/orders/:db/:id',
			getComponent(location, cb) {
				System.import('./containers/Order.jsx')
				.then(module => cb(null, module.default));
			}
		},
		{
			path: '/orders/:db/:id/:action',
			getComponent(location, cb) {
				System.import('./containers/Order.jsx')
				.then(module => cb(null, module.default));
			}
		},
		{
			path: '/products',
			getComponent(location, cb) {
				import('./containers/Product.jsx')
				.then(module => cb(null, module.default));
			}
		},
		{
			path: '/products/:action/:id',
			getComponent(location, cb) {
				import('./containers/Product.jsx')
				.then(module => cb(null, module.default));
			}
		}
		,
		{
			path: '/postal',
			getComponent(location, cb) {
				System.import('./containers/Postal.jsx')
				.then(module => cb(null, module.default));
			}
		},
		{
			path: '/accounts',
			getComponent(location, cb) {
				System.import('./containers/Account.jsx')
				.then(module => cb(null, module.default));
			}
		}
	]
};

const Routes = () => { 
	return (
		<Router history={hashHistory} routes={componentRoutes} />
	);
}

render( <Provider store={store}>
		{Routes()}
    </Provider>, app);
