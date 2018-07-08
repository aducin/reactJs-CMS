import React from 'react';
import { Link } from 'react-router';

import ReactTooltip from 'react-tooltip';
import 'font-awesome/css/font-awesome.min.css';

import ButtonSingle from '../dumb/ButtonSingle.jsx';
import Href from '../dumb/Href.jsx';
import Input from '../dumb/Input.jsx';
import Label from '../dumb/Label.jsx';
import Row from '../dumb/Row.jsx';
import Title from '../dumb/Title.jsx';

const labelWidth = 'col-xs-12 col-lg-4';
const paddingTop022 = {paddingTop: '2.2%'}
const paddingTop3 = {paddingTop: '3%'}
const paragraphWidth = 'col-xs-12 col-lg-8';
const voucherFields = ['Numer ID', 'Referencja', 'Koszt produktów', 'Koszt transportu', 'Data', 'Number kuponu'];

const OrderDetail = ( props ) => {
	let empty = (props.details.additionalData === false && props.details.orderData === null);
	let message = props.message.orders;
	if (empty || props.empty) {
		return (
			<div class="container bgrContent borderRadius10 marginTop40px paddingBottom40px">
				<div class="col-xs-12">
					<div class="col-xs-12">
						<Title title={message.noAction} />
					</div>
				</div>
			</div>
		);
	} else {
		let baseUrl = props.url.shopUrl;
		let buttons;
		let buttonsSecondLine;
		let contentArray = [];
		let customer;
		let data;
		let db = props.details.currentDb === 'new' ? 'nowy panel' : 'stary panel';
		let details;
		let display = false;
		let displayDiv;
		const displayPhoto = function(cover, bool) {
			props.setDisplay(cover, bool);
		}
		let id = props.details.currentId;
		let name;
		let path;
		let reference;
		let shortCut;
		let evenState = props.details.additionalTask === 'even';
		let summary;
		let tableHeaders;
		let title;
		let totalPaid;
		if (props.details.additionalTask === 'voucher') {
			data = props.details.additionalData;
			customer = data.customer;
			let curName = customer.firstname + ' ' + customer.lastname;
			title = props.message.orders.voucherTitle + ' ' + curName;
			details = (
				<div class="container">
					<div class="col-xs-12 marginTop20px">
						<Row label={props.message.orders.email} content={customer.email} />
					</div>
					<div class="col-xs-12 marginTop10px">
						<Row label={props.message.orders.voucherLast} content={data.lastVoucher} />
					</div>
				</div>
			);
			if (data.lastVoucher == 0) {
				summary = (
					<div class="colorWarning marginTop10px">
						<Title title={props.message.orders.noVoucher} />
					</div>
				);
			} else {
				let headerArray = [];
				voucherFields.forEach((el, index) => {
					headerArray.push(
						<th key={index} class="col-xs-2 textAlignCenter">{el}</th>
					);
				});
				tableHeaders = (
					<tr>
						{headerArray}
					</tr>
				);
				data.data.forEach((el, index) => {
					let url = "#/orders/old/" + el.id;
					contentArray.push(
						<tr key={index} class="textAlignCenter">
							<td class="col-xs-2"><a href={url}>{el.id}</a></td>
							<td class="col-xs-2">{el.reference}</td>
							<td class="col-xs-2">{el.totalProduct}{props.message.currency}</td>
							<td class="col-xs-2">{el.totalShipping}{props.message.currency}</td>
							<td class="col-xs-2">{el.dateAdd}</td>
							<td class="col-xs-2">{el.voucherNumber}</td>
						</tr>
					);
				});
			}
			let curNumber = props.currentVoucher !== null ? props.currentVoucher : data.lastVoucher;
			let showMailUrl = props.url.serverPath + 'orders/' + props.details.currentDb + '/' + id +
				'/mail?action=voucher&result=display&voucherNumber=' + curNumber;
			buttons = (
				<div class="marginTop10px">
					<div class="col-xs-12 col-md-2 marginTop10px">
						<label>{props.message.orders.voucherNumber}</label>
					</div>
					<div class="col-xs-12 col-md-1 marginTop15px" data-tip={props.message.orders.voucherPlus}>
						<i onClick={ () => props.voucherChange('add', curNumber) } class="fa fa-plus cursorPointer"></i>
					</div>
					<div class="col-xs-12 col-md-1 marginTop10px">
						{curNumber}
					</div>
					<div class="col-xs-12 col-md-1 marginTop15px" data-tip={props.message.orders.voucherMinus}>
						<i onClick={ () => props.voucherChange('subtract', curNumber) } class="fa fa-minus cursorPointer"></i>
					</div>
					<Href
						link={showMailUrl}
						classMain="col-xs-12 col-md-2 pull-left"
						className="form-control btn btn-primary"
						content={message.showEmail}
					/>
					<div class="col-xs-12 col-md-2">
						<input class="form-control btn btn-primary cursorPointer" type="button" value={message.send} onClick={ () => props.send(curNumber) } />
					</div>
					<ButtonSingle link="orders" classMain="col-xs-12 col-md-2" className="form-control btn btn-danger" content={message.delete} />
				</div>
			);
		} else if (evenState) {
			data = props.details.additionalData;
			title = props.message.orders.evenTitle + props.details.currentId + ' - ' + db;
			let currentPanel = props.details.currentDb === 'new' ? 'NP' : 'SP';
			let otherPanel = props.details.currentDb === 'new' ? 'SP' : 'NP';
			tableHeaders = (
				<tr>
					<th class="col-xs-1 textAlignCenter">Miniatura<br/>(SP)</th>
					<th class="col-xs-1 textAlignCenter">Numer<br/>ID</th>
					<th class="col-xs-4 textAlignCenter">Nazwa<br/>produktu</th>
					<th class="col-xs-1 textAlignCenter">Ilość<br/>(zakup)</th>
					<th class="col-xs-1 textAlignCenter">Ilość<br/>({currentPanel})</th>
					<th class="col-xs-1 textAlignCenter">Przed<br/>({otherPanel})</th>
					<th class="col-xs-1 textAlignCenter">Po<br/>({otherPanel})</th>
					<th class="col-xs-2 textAlignCenter">Akcja /<br/>Linki</th>
				</tr>
			);
			let backUrl = 'orders/' + props.details.currentDb + '/' + id;
			props.details.additionalData.forEach((el, index) => {
				let backId = "products/history/" + el.id;
				let curId = "products/edition/" + el.id;
				let curUrl = baseUrl + el.id + '-' + el.linkRewrite + '.html';
				let modification = el.modification !== '---' ? el.modification : props.message.orders.sameAmount;
				contentArray.push(
					<tr key={index} class="textAlignCenter">
						<td class="col-xs-1"><img onMouseOver={displayPhoto.bind(this, el.cover, true)} onMouseOut={displayPhoto.bind(this, null, false)} src={el.cover} style={props.images.imgCssSmall} /></td>
						<td class="col-xs-1" style={paddingTop3}>{el.id}</td>
						<td class="col-xs-4" style={paddingTop3}><a href={curUrl} target="blank">{el.name}</a></td>
						<td class="col-xs-1" style={paddingTop3}>{el.ordered}</td>
						<td class="col-xs-1" style={paddingTop3}>{el.baseDbQuantity}</td>
						<td class="col-xs-1" style={paddingTop3}>{el.quantityBeforeChange}</td>
						<td class="col-xs-1" style={paddingTop3}>{el.quantityAfterChange}</td>
						<td class="col-xs-2" style={paddingTop3}>
							<div>
								<span>{modification}</span><br/>
								<Link to={curId}>Edycja</Link><br/>
								<Link to={backId}>Historia</Link>
							</div>
						</td>
					</tr>
				);
			});
			let orderUrl = 'orders/' + props.details.currentDb + '/' + id ;
			buttons = (
				<div class="marginTop10px">
					<ButtonSingle link={orderUrl} classMain="col-xs-12 col-md-3" className="form-control btn btn-primary" content={message.back} />
					<ButtonSingle link="orders" classMain="col-xs-12 col-md-3" className="form-control btn btn-danger" content={message.delete} />
				</div>
			);
		} else {
			data = Boolean(props.details.additionalTask) ?  props.details.additionalData : props.details.orderData;
			customer = data.customer;
			shortCut = props.details.orderData ? props.details.orderData : props.details.additionalData;
			reference = shortCut.reference;
			title = props.message.orders.details + id	+ ' (' + reference + ') - ' + db;
			name = shortCut.customer.firstname + ' ' + shortCut.customer.lastname;
			totalPaid =  data.totalPaid + props.message.currency;
			let detailsArray = [];
			detailsArray.push(
				<div key="1" class="col-xs-12 marginTop10px">
					<Row label="Klient:" content={name} labelWidth={labelWidth} paragraphWidth={paragraphWidth}/>
				</div>
			);
			detailsArray.push(
				<div key="2" class="col-xs-12 marginTop10px">
					<Row label="Adres e-mail:" content={customer.email} labelWidth={labelWidth}
							 paragraphWidth={paragraphWidth}/>
				</div>
			);
			if (!props.details.additionalTask) {
				detailsArray.push(
					<div key="3" class="col-xs-12 marginTop10px">
						<Row label="Kwota (zł):" content={totalPaid} labelWidth={labelWidth} paragraphWidth={paragraphWidth}/>
					</div>
				);
			}
			details = (
				<div class="container">
					{detailsArray}
				</div>
			);
			tableHeaders = (
				<tr>
					<th class="col-xs-1 textAlignCenter">Miniatura</th>
					<th class="col-xs-1 textAlignCenter">Numer ID</th>
					<th class="col-xs-4 textAlignCenter">Nazwa</th>
					<th class="col-xs-2 textAlignCenter">Na stanie</th>
					<th class="col-xs-2 textAlignCenter">Na stanie<br/>(drugi sklep)</th>
					<th class="col-xs-1 textAlignCenter">Zamówione</th>
					<th class="col-xs-1 textAlignCenter">Opcje</th>
				</tr>
			);
			data.cartDetails.forEach(function(el, index) {
				let curId = "products/edition/" + el.productId;
				let curUrl = baseUrl + el.productId + '-' + el.linkRewrite + '.html';
				contentArray.push(
					<tr key={index} class="textAlignCenter">
						<td class="col-xs-1"><img onMouseOver={displayPhoto.bind(this, el.cover, true)} onMouseOut={displayPhoto.bind(this, null, false)} src={el.cover} style={props.images.imgCssSmall} /></td>
						<td class="col-xs-1" style={paddingTop022}>{el.productId}</td>
						<td class="col-xs-4" style={paddingTop022}><a href={curUrl} target="blank">{el.productName}</a></td>
						<td class="col-xs-2" style={paddingTop022}>{el.quantity.current}</td>
						<td class="col-xs-2" style={paddingTop022}>{el.quantity.toUpdate}</td>
						<td class="col-xs-1" style={paddingTop022}>{el.productQuantity}</td>
						<td class="col-xs-1" style={paddingTop022}><ButtonSingle link={curId} className="btn btn-primary" content={props.message.orders.fullEdition} /></td>
					</tr>
				);
			}, this);
			if (props.details.additionalTask === 'discount') {
				let bottomDetails = (
					<div class="container marginTop10px">
						<div class="col-xs-12 col-lg-3 pull-left"></div>
						<div class="col-xs-12 col-lg-6 pull-left">
							<label class="col-xs-6">{props.message.orders.total}</label>
							<p class="col-xs-6">{data.totalPaid}{props.message.currency}</p>
							<label class="col-xs-6">{props.message.orders.totalDiscount}</label>
							<p class="col-xs-6 colorWarning">{data.totalPaidDiscount}{props.message.currency}</p>
							<label class="col-xs-6">{props.message.orders.totalShipping}</label>
							<p class="col-xs-6">{data.totalProduct}{props.message.currency}</p>
							<label class="col-xs-6">{props.message.orders.totalShippingDiscount}</label>
							<p class="col-xs-6 colorWarning">{data.totalProductDiscount}{props.message.currency}</p>
						</div>
						<div class="col-xs-12 col-lg-3 pull-left"></div>
					</div>
				);
				summary = (
					<div class="marginTop20px">
						<Title title={props.message.orders.summary} />
						{bottomDetails}
					</div>
				);
			}
			let even = 'orders/' + props.details.currentDb + '/' + id + '/even' ;
			if (!props.details.additionalTask) {
				let buttonsArray = [];
				buttonsArray.push(
					<ButtonSingle key="1" link={even} classMain="col-xs-12 col-md-3" className="form-control btn btn-primary"
												content={message.even}/>
				);
				buttonsArray.push(
					<ButtonSingle key="2" link="orders" classMain="col-xs-12 col-md-3" className="form-control btn btn-danger"
												content={message.delete}/>
				);
				if (!props.shipmentNumber) {
					buttonsArray.push(
						<div key="3" class="col-xs-12 col-lg-3">
							<input class="form-control btn btn-primary cursorPointer" type="button" value={message.shipmentNumber} onClick={ () => props.shipmentNumberHandler() } />
						</div>
					);
				} else {
					buttonsArray.push(
						<div key="3" class="col-xs-12 col-lg-3">
							<input class="form-control btn btn-danger cursorPointer" type="button" value={props.message.goBack} onClick={ () => props.shipmentNumberHandler() } />
						</div>
					);
					buttonsArray.push(
						<div key="4" class="col-xs-12 col-lg-3">
							<input class="form-control btn btn-primary cursorPointer" disabled={props.curShipment.length < 9} type="button" value={message.send} onClick={ () => props.send(props.curShipment) } />
						</div>
					);
					buttonsSecondLine = (
						<div class="col-xs-12 marginTop20px">
							<Label name={message.typeShipmentNumber.name} labelClass="marginTop10px" />
							<Input placeholder={message.typeShipmentNumber.placeholder} changeHandler={(e) =>props.setShipmentNumber(e)} name="shipment" value={props.curShipment} />
						</div>
					);
				}
				buttons = (
					<div class="marginTop10px">
						{buttonsArray}
					</div>
				);
			} else {
				let showMailUrl;
				if (props.details.additionalTask === 'discount') {
					showMailUrl = props.url.serverPath + 'orders/' + props.details.currentDb + '/' + id + '/mail?action=discount&result=display';
				} else if (props.details.additionalTask === 'mail') {
					showMailUrl = props.url.serverPath + 'orders/' + props.details.currentDb + '/' + id + '/mail?action=undelivered&result=display';
				}
				buttons = (
					<div class="marginTop10px">
						<Href
							link={showMailUrl}
							classMain="col-xs-12 col-md-3 pull-left"
							className="form-control btn btn-primary"
							content={message.showEmail}
						/>
						<div class="col-xs-12 col-lg-3">
							<input class="form-control btn btn-primary cursorPointer" type="button" value={message.send} onClick={ () => props.send() } />
						</div>
						<ButtonSingle link="orders" classMain="col-xs-12 col-md-3" className="form-control btn btn-danger"
													content={message.delete}/>
					</div>
				);
			}
		}
		let displayImg = null;
		if (props.display) {
			displayImg = <img src={props.display} style={props.images.imgCssFixed} />
		}
		return(
			<div class="container bgrContent paddingBottom2 marginTop2 borderRadius10">
				<div class="marginTop20px">
					<Title title={title} />
				</div>
				{details}
				<div class="col-xs-12 pull-left">
					<div class="marginTop20px">
						<table class="table table-striped table-bordered">
							<thead>
							{tableHeaders}
							</thead>
							<tbody>
							{contentArray}
							</tbody>
						</table>
						{summary}
					</div>
					{buttons}
					{buttonsSecondLine}
				</div>
				{displayImg}
				<ReactTooltip />
			</div>
		);
	}
}

export default OrderDetail;