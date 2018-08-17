import React from 'react';
import { Link } from 'react-router';

import ButtonSingle from '../../dumb/ButtonSingle.jsx';
import Config from '../../../Config';

const paddingTop2 = {paddingTop: '2%'};
const paddingTop022 = {paddingTop: '2.2%'};
const paddingTop3 = {paddingTop: '3%'};
const paddingTop29px = {paddingTop: '29px'};
const paddingTop30px = {paddingTop: '30px'};

const tableContent = (props) => {
  let el = props.el;
  let result;
  if (props.name === 'default') {
    let curId = "products/edition/" + el.productId;
    let curUrl = Config.url.shopUrl + el.productId + '-' + el.linkRewrite + '.html';
    result = (
      <tr key={props.index} class="textAlignCenter">
        <td class="col-xs-1">
          <img onMouseOver={() => props.action(el.cover, true)} onMouseOut={() => props.action(null, false)} src={el.cover} style={Config.images.imgCssSmall} />
        </td>
        <td class="col-xs-1" style={paddingTop30px}>{el.productId}</td>
        <td class="col-xs-4" style={paddingTop30px}><a href={curUrl} target="blank">{el.productName}</a></td>
        <td class="col-xs-2" style={paddingTop30px}>{el.quantity.current}</td>
        <td class="col-xs-2" style={paddingTop30px}>{el.quantity.toUpdate}</td>
        <td class="col-xs-1" style={paddingTop29px}>{el.productQuantity}</td>
        <td class="col-xs-1" style={paddingTop022}>
          <ButtonSingle link={curId} className="btn btn-primary" content={Config.message.fullEdition} />
        </td>
      </tr>
    );
  } else if (props.name === 'even') {
    let backId = "products/history/" + el.id;
    let curId = "products/edition/" + el.id;
    let curUrl = Config.url.shopUrl + el.id + '-' + el.linkRewrite + '.html';
    result = (
      <tr key={props.index} class="textAlignCenter">
        <td class="col-xs-1">
          <img
            onMouseOver={ () => props.action(el.cover, true) }
            onMouseOut={ () => props.action(null, false) }
            src={el.cover}
            style={Config.images.imgCssSmall}
          />
        </td>
        <td class="col-xs-1" style={paddingTop3}>{el.id}</td>
        <td class="col-xs-4" style={paddingTop3}><a href={curUrl} target="blank">{el.name}</a></td>
        <td class="col-xs-1" style={paddingTop3}>{el.ordered}</td>
        <td class="col-xs-1" style={paddingTop3}>{el.baseDbQuantity}</td>
        <td class="col-xs-1" style={paddingTop3}>{el.quantityBeforeChange}</td>
        <td class="col-xs-1" style={paddingTop3}>{el.quantityAfterChange}</td>
        <td class="col-xs-2" style={paddingTop2}>
          <div>
            <span>{el.modification}</span><br/>
            <Link to={curId}>Edycja</Link><br/>
            <Link to={backId}>Historia</Link>
          </div>
        </td>
      </tr>
    );
  } else if (props.name === 'voucher') {
    let url = "#/orders/old/" + el.id;
    result = (
      <tr key={props.index} class="textAlignCenter">
        <td class="col-xs-2"><a href={url}>{el.id}</a></td>
        <td class="col-xs-2">{el.reference}</td>
        <td class="col-xs-2">{el.totalProduct}{Config.message.currency}</td>
        <td class="col-xs-2">{el.totalShipping}{Config.message.currency}</td>
        <td class="col-xs-2">{el.dateAdd}</td>
        <td class="col-xs-2">{el.voucherNumber}</td>
      </tr>
    );
  }
  return result;
};

export default tableContent;
