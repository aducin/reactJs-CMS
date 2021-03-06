import React from 'react';
import ReactDOM from 'react-dom';

import Config from '../../Config';
import Helper from '../../helper/Helper.jsx';
import Title from '../dumb/Title.jsx';
import Busy from '../dumb/Busy.jsx';
import ButtonSingle from '../dumb/ButtonSingle.jsx';

const ProductHistory = ( props ) => {
	const product = props.product;
	const text = Config.message;
	let history = product.history;
	let urlAddress = "products/edition/" + history.id;
	if (!product.searched) {
		return (
			<Busy title={text.loading} />
		)
	} else if (product.history.empty) {
		return (
		<div class="container bgrContent paddingBottom2 marginTop2 borderRadius10">
			<Title title={text.products.noHistory} />
			<ButtonSingle link={urlAddress} classMain="col-xs-12 col-md-2" className="form-control btn btn-primary" content="Edycja" />
			<ButtonSingle link="products" classMain="col-xs-12 col-md-2" className="form-control btn btn-info" content="Wyczyść" />
		</div>
		)
	} else {
		let head = Helper.createTableHead(['Lp.', 'ID', 'Data', 'Ilość', 'Miejsce', 'Sklep']);
		let title = text.historyTitle + history.id;
		let finalList = history.list.map((el, index) => {
			return (
	    		<tr key={index}>
			    	<td>
			    		<p class="textCentered marginTop10px">{index + 1}</p>
			    	</td>
			    	<td>
			    		<p class="textCentered marginTop10px">{el.id}</p>
			    	</td>
			    	<td class="textCentered">
			    		<p class="textCentered marginTop10px">{el.date}</p>
			    	</td>
			    	<td class="textCentered">
			    		<p class="textCentered marginTop10px">{el.quantity}</p>
			    	</td>
			    	<td class="textCentered">
			    		<p class="textCentered marginTop10px">{el.user}</p>
			    	</td>
			    	<td class="textCentered">
			    		<p class="textCentered marginTop10px">{el.dataBase}</p>
			    	</td>
			    </tr>
	    	)
		});	
		var table = Helper.setTable(title, head, finalList);
		return (
			<div class="container bgrContent paddingBottom2 marginTop2 borderRadius10">
				{table}
				<ButtonSingle link={urlAddress} classMain="col-xs-12 col-md-3" className="form-control btn btn-primary" content="Edycja" />
				<ButtonSingle link="products" classMain="col-xs-12 col-md-3" className="form-control btn btn-info" content="Wyczyść" />
			</div>
		)
	}

}

export default ProductHistory;	