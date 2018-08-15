import React from 'react';
import ReactTooltip from 'react-tooltip';

import { redirect } from '../product/redirect';

import Config from '../../Config';
import Title from '../../components/dumb/Title.jsx';

const styles = {
  paddingTop: {paddingTop: '45px'}
};
const url = Config.url;

export const setContent = (list, modal) => {
  return list.map((el) => {
    let price = el.price;
    let discount = el.discount;
    let priceNew = setPrice('new', discount, price);
    let priceOld = setPrice('old', discount, price);
    return setRow(el, priceNew, priceOld, modal);
  });
};

export const setEmpty = (clear) => {
  return(
    <div>
      <Title title={Config.message.noNameList} />
      <div class="col-xs-9 col-md-11 pull-left"></div>
      <div class="col-xs-3 col-md-1 pull-left">
        <input
          class="form-control btn btn-primary pull-right"
          type="button"
          value={Config.message.clear}
          onClick={ () => clear() }
        />
      </div>
    </div>
  );
};

const setPrice = (type, discount, curPrice) => {
  let price;
  if (!discount[type]) {
    price = (
      <div>
        <p class="textCentered marginTop40px">{curPrice[type]}{Config.message.currency}</p>
      </div>
    );
  } else {
    let reduction = discount[type].reduction;
    let finalReduction = reduction * 100;
    let amount = curPrice[type] * reduction;
    let finalPrice = (curPrice[type] - amount).toFixed(2);
    price = (
      <div>
        <p class="textCentered marginTop20px">{finalPrice}zł</p>
        <p class="textCentered marginTop10px colorWarning">UWAGA! Rabat {finalReduction}%</p>
      </div>
    );
  }
  return price;
};

const setRow = (el, priceNew, priceOld, modal) => {
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
          <i onClick={ () => modal({id: el.id}) } data-tip="Szybka edycja" class="fa fa-object-ungroup cursorPointer"></i>
        </div>
        <div class="col-xs-6 pull-right marginTop40px">
          <i onClick={ () => setUrl('edition', el.id) } data-tip="Pełna edycja" class="fa fa-bars cursorPointer"></i>
        </div>
      </td>
    </tr>
  );
};

const setUrl = (path, id) => redirect(path, id);
