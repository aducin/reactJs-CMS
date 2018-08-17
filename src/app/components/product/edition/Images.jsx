import React from 'react';
import ReactTooltip from 'react-tooltip';

import Config from '../../../Config';
import Checkbox from '../../dumb/Checkbox.jsx';
import Label from '../../dumb/Label.jsx';

const cssPadding12 = { paddingBottom: 12, paddingTop: 12 };
const imgCss = { height: '100px', width: '100px', color: 'blue', border: '1px solid #ddd', borderRadius: 3};

const images = ( props ) => {
  let imageLength, imageList, imageContent;
  if (Array.isArray(props.images)) {
    imageLength = Config.message.imageLength + props.images.length;
    imageList = props.images.map((el) => {
      return <img key={ el } src={ el } style={ imgCss } />
    });
  }
  if (props.display) {
    imageContent = (
      <div class="col-xs-12 col-lg-9" style={ cssPadding12 }>
        {imageList}
      </div>
    );
  } else {
    imageContent = (
      <div class="col-xs-12 col-lg-9">
        <div class="col-xs-12">
          <p data-tip={Config.message.actions.showMiniatures} style={ cssPadding12 }><i>{imageLength}</i></p>
          <ReactTooltip />
        </div>
      </div>
    )
  }
  return (
    <div onClick={ props.action.bind(this, 'image') }>
      <Label heightRow="3" name="Zdjęcia:" cssStyle={ cssPadding12 } />
      {imageContent}
    </div>
  );
};

export default images;
