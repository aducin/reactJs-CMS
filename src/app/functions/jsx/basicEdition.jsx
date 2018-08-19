import React from 'react';

import Config from '../../Config';
import ButtonSingle from '../../components/dumb/ButtonSingle.jsx';

export const setContent = (data, name, quantity, price, image) => {
  const centered = { display: 'block', margin: 'auto', border: '1px solid #C8C8C8', borderRadius: '10px' };
  let imagePath = Config.url.path + 'img/p/' + data.id + '-' + image + '-thickbox.jpg';
  return (
    <div>
      <div class="marginTop10px">
        <img src={imagePath} alt={data.name} style={centered} height="350" width="350" />
      </div>
      {name}
      <div class="col-xs-12 marginTop10px"></div>
      {quantity}
      <div class="col-xs-12 marginTop10px"></div>
      {price}
    </div>
  );
};

export const setFooter = (data, disabledSave, action, save) => {
  let editionUrl = 'products/edition/' + data.id;
  let historyUrl = 'products/history/' + data.id;
  return(
    <div>
      <div class="col-xs-12 pull-left marginTop10px">
        <div class="col-xs-12 col-md-3 pull-left">
          <input class="form-control btn btn-primary pull-right" disabled={ disabledSave } type="button" value="Zapisz" onClick={ save.bind(this) } />
        </div>
        <ButtonSingle link={editionUrl} classMain="col-xs-12 col-md-3" className="form-control btn btn-info" content="Pełna edycja" />
        <ButtonSingle link={historyUrl} classMain="col-xs-12 col-md-3" className="form-control btn btn-info" content="Historia" />
        <div class="col-xs-12 col-md-3 pull-left">
          <input class="form-control btn btn-info pull-right" type="button" value="Zamknij" onClick={ action.bind(this) } />
        </div>
      </div>
    </div>
  );
};
