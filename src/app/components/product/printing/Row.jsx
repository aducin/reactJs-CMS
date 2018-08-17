import React from 'react';

import Config from '../../../Config';

const row = ( props ) => {
  let data = props.data;
  return data.map((el, index) => {
    let linkPath = Config.url.filePath + 'printing/' + el.id + '/' + el.name;
    return (
      <tr key={ index } class="textCentered">
        <td style={Config.padding15px}>{index + 1}</td>
        <td style={Config.padding15px}><a href={linkPath} target="blank">{el.name}</a></td>
        <td style={Config.padding15px}>{el.description}</td>
        <td style={Config.padding15px}>{el.createdTime}</td>
        <td>
          <div class="col-xs-6 pull-left marginTop7px">
            <a href={linkPath} download>
              <i class="fa fa-download" aria-hidden="true"></i>
            </a>
          </div>
          <div class="col-xs-6 pull-left marginTop7px">
            <i onClick={ () => props.deleteHandler(el.id) } class="fa fa-trash cursorPointer" aria-hidden="true"></i>
          </div>
        </td>
      </tr>
    )
  });
};

export default row;