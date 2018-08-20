import React from 'react';

import Config from '../../../Config';

const xml = ( props ) => {
  let link = props.link;
  if (link) {
    return(
      <div class="col-xs-12 col-sm-4 col-md-12 marginTop10px">
        <a href={link} download>{Config.message.account.downloadXml}</a>
      </div>
    );
  } else {
    return(
      <div class="col-xs-12 col-sm-4 col-md-12 marginTop10px">
        <input
          class="form-control btn btn-primary maxWidth160"
          disabled={!props.propsXml}
          onClick={ () => props.createXml() }
          type="button"
          value={ Config.message.account.createXml }
        />
      </div>
    );
  }
};

export default xml;
