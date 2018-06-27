import React from 'react';
/*
const valueChange = (e) => {
	let curObj = {
		inputValue: e.target.value,
		name: e.target.name
	};
	console.log(curObj);
	this.props.inputChange(curObj);
}
*/
const input = ( props ) => {
	let curType = "text";
  if (props.curType) {
    curType = props.curType;
  }
  let standard = "col-xs-12 col-md-6";
  if (props.heightRow) {
    standard = "col-xs-12 col-md-" + props.heightRow;
  }
  let curClass = "form-control textAlignCenter";
  if (props.noCenter) {
    curClass = "form-control";
  } else if (props.additionalClass) {
    curClass += ' ' + props.additionalClass;
  }
  let disable = props.disable ? props.disable : false;
	return (
		<div class={standard}>
			<input class={curClass} type={curType} defaultValue={props.value} disabled={disable} name={props.name} onChange={ (e) => props.changeHandler( e ) } onKeyUp={ (e) => props.changeHandler( e ) } placeholder={props.placeholder}/>
		</div>
	);
}

export default input;