import React from 'react';
import ReactDOM from 'react-dom';
import ReactTooltip from 'react-tooltip';
import 'font-awesome/css/font-awesome.min.css';

import setContent from '../../functions/jsx/productList.jsx';
import Empty from './list/Empty.jsx';

import Config from '../../Config';
import Helper from '../../helper/Helper.jsx';
import Busy from '../dumb/Busy.jsx';
import ButtonSingle from '../dumb/ButtonSingle.jsx';

const ProductList = ( props ) => {
	const product = props.product;
	const text = Config.message;
	if (!product.searched) {
		return <Busy title={text.loading} />;
	} else {
		if (product.nameList === undefined || product.nameList.length === 0) {
			return (
				<Empty clear={props.clearList} />
			);
		} else {
			let list = product.nameList;
			let title = product.anotherSearch ? <span>{text.lastSearchList} ({list.length} szt.)</span> : <span>{text.listOfProducts} ({list.length} szt.)</span>;
			let head = Helper.createTableHead(['ID', 'Miniatura', 'Nazwa', 'Ilość', 'Cena (SP)', 'Cena (NP)', 'Akcja']);
			let finalList = setContent(list, props.modal);
			let table = Helper.setTable(title, head, finalList);
			return (
				<div class="container bgrContent paddingBottom2 marginTop2 borderRadius10">
					{table}
					<div class="col-xs-8 col-md-10 pull-left"></div>
					<div class="col-xs-4 col-md-2 pull-left">
					    <input class="form-control btn btn-primary pull-right" type="button" value={text.clear} onClick={ () => props.clearList() } />
					</div>
					<ReactTooltip />
				</div>
			);
		}
	}
};

export default ProductList;
