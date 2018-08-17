import React from 'react';

import Label from '../../components/dumb/Label.jsx';

import WithClass from '../hoc/withClass.jsx';

const select = ( props ) => {
  if (props.curClass === undefined) {
    var curClass = 'col-xs-12';
  } else {
    var curClass = props.curClass;
  }
  if (props.widthLabel === undefined) {
    var widthLabel = "col-xs-12 col-md-6"
  } else {
    var widthLabel = "col-xs-12 col-md-" + props.widthLabel;
  }
  if (props.widthSelect === undefined) {
    var widthSelect = "col-xs-12 col-md-6"
  } else {
    var widthSelect = "col-xs-12 col-md-" + props.widthSelect;
  }
	return (
		<WithClass curClass={curClass}>
       <Label name={props.title} />
			 <div class={widthSelect}>
			    <select class="form-control" disabled={props.setDisabled} name={ props.name } onChange={ (e) => props.selectChange(e) } value={ props.value }>{props.list}</select>
			 </div>
		</WithClass>
	);
}

export default select;