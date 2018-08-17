import React from 'react';

import Config from '../../../Config';
import { redirect } from '../../../functions/product/redirect';

const setUrl = (path, id) => redirect(path, id);
const styles = {
  paddingTop: {paddingTop: '45px'}
};

const row = ( props ) => {
  const el = props.el;
  const priceNew = props.priceNew;
  const priceOld = props.priceOld;
  const modal = props.modal;
  const linkPath = Config.url.path + 'wagony-n/' + el.id + '-' + el.link_rewrite + '.html';
  const imagePath = Config.url.path + 'img/p/' + el.id + '-' + el.image + '-thickbox.jpg';
  return (
    <tr key={props.index}>
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

export default row;
