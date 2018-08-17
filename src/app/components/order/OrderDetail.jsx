import React from 'react';
import { Link } from 'react-router';

import 'font-awesome/css/font-awesome.min.css';

import Config from '../../Config';

import Buttons from './detail/Buttons.jsx';
import Details from './detail/Details.jsx';
import Empty from './detail/Empty.jsx';
import Header from './detail/Header.jsx';
import { setContent, setTableContent } from '../../functions/jsx/order.jsx';
import SecondLine from './detail/SecondLine.jsx';
import Summary from './detail/Summary.jsx';

const OrderDetail = ( props ) => {
	let empty = (props.details.additionalData === false && props.details.orderData === null);
	const message = Config.message.orders;
	if (empty || props.empty) {
		return <Empty />;
	} else {
		let buttons, buttonsSecondLine, customer, data, details, name, reference, shortCut, summary, tableHeaders, title, totalPaid;
		let contentArray = [];
		let db = props.details.currentDb === 'new' ? 'nowy panel' : 'stary panel';
		let id = props.details.currentId;
		let evenState = props.details.additionalTask === 'even';
		if (props.details.additionalTask === 'voucher') {
      data = props.details.additionalData;
      title = message.voucherTitle + ' ' + data.customer.firstname + ' ' + data.customer.lastname;
			details = <Details name="voucher" customer={data.customer} data={data} />;
			if (data.lastVoucher == 0) {
        summary = <Summary name="voucher" />;
			} else {
				tableHeaders = <Header action="voucher" />;
        contentArray = setTableContent("voucher", data.data);
			}
      let curNumber = props.currentVoucher !== null ? props.currentVoucher : data.lastVoucher;
      buttons = (
        <Buttons name="voucher" action={props.voucherChange} details={props.details} number={curNumber} send={props.send} />
      );
		} else if (evenState) {
      title = message.evenTitle + props.details.currentId + ' - ' + db;
			tableHeaders = <Header action="even" db={props.details.currentDb} />;
			contentArray = setTableContent("even", props.details.additionalData, props.setDisplay);
			buttons = <Buttons name="even" details={props.details} />;
		} else {
			data = Boolean(props.details.additionalTask) ?  props.details.additionalData : props.details.orderData;
			shortCut = props.details.orderData ? props.details.orderData : props.details.additionalData;
			title = message.details + id	+ ' (' + shortCut.reference + ') - ' + db;
			details = <Details name="default" customer={data.customer} data={data} details={props.details} />;
			tableHeaders = <Header action="default" />;
			contentArray = setTableContent("default", data.cartDetails, props.setDisplay);
			if (props.details.additionalTask === 'discount') {
        summary = <Summary name="discount" data={data} />;
			}
			if (!props.details.additionalTask) {
        buttons = (
          <Buttons
            name="default"
            details={props.details}
            action={props.shipmentNumberHandler}
            number={props.shipmentNumber}
            send={props.send}
            shipment={props.curShipment}
          />
        );
        if (!props.shipmentNumber) {
          buttonsSecondLine = <SecondLine action={props.setShipmentNumber} curShipment={props.curShipment} />;
        }
			} else {
        buttons = <Buttons name="additional" details={props.details} send={props.send} />;
			}
		}
    let displayImg = props.display ? <img src={props.display} style={Config.images.imgCssFixed} /> : null;
		return setContent(title, details, tableHeaders, contentArray, summary, buttons, buttonsSecondLine, displayImg);
	}
};

export default OrderDetail;
