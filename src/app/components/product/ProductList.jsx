import React from 'react';
import ReactDOM from 'react-dom';
import ReactTooltip from 'react-tooltip';
import 'font-awesome/css/font-awesome.min.css';

import { redirect } from '../../functions/product/redirect';

import Config from '../../Config';
import Helper from '../../helper/Helper.jsx';
import Title from '../dumb/Title.jsx';
import Busy from '../dumb/Busy.jsx';
import ButtonSingle from '../dumb/ButtonSingle.jsx';

const styles = {
	paddingTop: {paddingTop: '45px'}
};

const ProductList = ( props ) => {
	const setUrl = (path, id) => redirect(path, id);
	const product = props.product;
	const text = Config.message;
	const url = Config.url;
	if (!product.searched) {
		return <Busy title={text.loading} />;
	} else {
		if (product.nameList === undefined || product.nameList.length === 0) {
			return (
				<div>
					<Title title={text.noNameList} />
					<div class="col-xs-9 col-md-11 pull-left"></div>
					<div class="col-xs-3 col-md-1 pull-left">
					    <input class="form-control btn btn-primary pull-right" type="button" value="Wyczyść" onClick={ () => props.clearList() } />
					</div>
				</div>
			)
		} else {
			let list = product.nameList;
			let title = product.anotherSearch ? <span>{text.lastSearchList} ({list.length} szt.)</span> : <span>{text.listOfProducts} ({list.length} szt.)</span>;
			let head = Helper.createTableHead(['ID', 'Miniatura', 'Nazwa', 'Ilość', 'Cena (SP)', 'Cena (NP)', 'Akcja']);
			let finalList = list.map((el) => {
				let price = el.price;
				let discount = el.discount;
				let priceNew, priceOld;
				if (!discount.new) {
					priceNew = (
						<div>
							<p class="textCentered marginTop40px">{price.new}zł</p>
						</div>
					);
				} else {
					let reduction = discount.new.reduction;
					let finalReduction = reduction * 100;
					let amount = price.new * reduction;
					let finalPrice = (price.new - amount).toFixed(2);
					priceNew = (
						<div>
							<p class="textCentered marginTop20px">{finalPrice}zł</p>
							<p class="textCentered marginTop10px colorWarning">UWAGA! Rabat {finalReduction}%</p>
						</div>
					);
				}
				if (!discount.old) {
					priceOld = (
						<div>
							<p class="textCentered marginTop40px">{price.old}zł</p>;
						</div>
					);
				} else {
					let reduction = discount.old.reduction;
					let finalPrice = (price.old - reduction).toFixed(2);
					priceOld = (
						<div>
							<p class="textCentered marginTop20px">{finalPrice}zł</p>
							<p class="textCentered marginTop10px colorWarning">UWAGA! Rabat {reduction}zł</p>
						</div>
					);
				}
				
				let urlAddress = "products/edition/" + el.id;
	    		let linkPath = url.path + 'wagony-n/' + el.id + '-' + el.link_rewrite + '.html';
	    		let imagePath = url.path + 'img/p/' + el.id + '-' + el.image + '-thickbox.jpg';
	    		return (
	    			<tr key={el.id}>
			    		<td>
			    			<p class="textCentered marginTop40px">ID: {el.id}</p>
			    		</td>
			    		<td class="textCentered">
			    			<img src={imagePath} class="imgMiniature" />
			    		</td>
			    		<td class="textCentered" style={styles.paddingTop}>
			    			<a href={linkPath} target="blank">{el.name}</a>
			    		</td>
			    		<td>
			    			<p class="textCentered marginTop40px">{el.quantity}</p>
			    		</td>
			    		<td>
			    			{priceNew}
			    		</td>
			    		<td>
			    			{priceOld}
			    		</td>
			    		<td>
								<div class="col-xs-6 pull-left marginTop40px">
			    				<i onClick={ () => props.modal({id: el.id}) } data-tip="Szybka edycja" class="fa fa-object-ungroup cursorPointer"></i>
			    			</div>
			    			<div class="col-xs-6 pull-right marginTop40px">
			    				<i onClick={ () => setUrl('edition', el.id) } data-tip="Pełna edycja" class="fa fa-bars cursorPointer"></i>
			    			</div>
			    		</td>
			        </tr>
	    		)
			});
			var table = Helper.setTable(title, head, finalList);
			return (
				<div class="container bgrContent paddingBottom2 marginTop2 borderRadius10">
					{table}
					<div class="col-xs-8 col-md-10 pull-left"></div>
					<div class="col-xs-4 col-md-2 pull-left">
					    <input class="form-control btn btn-primary pull-right" type="button" value="Wyczyść" onClick={ () => props.clearList() } />
					</div>
					<ReactTooltip />
				</div>
			);
		}
	}
	
}

export default ProductList;