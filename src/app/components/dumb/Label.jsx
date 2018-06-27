import React from 'react';

const label = ( props ) => {

	let cssStyle = null;
	if (props.cssStyle !== undefined) {
		cssStyle = props.cssStyle;
	}
	let mainClass = "col-xs-12 col-md-6";
	if (props.heightRow) {
		mainClass = "col-xs-12 col-md-" + props.heightRow;
	} else if (props.curClass) {
		mainClass = "col-xs-12 col-md-6 " + props.curClass;
	}
	let standard = 'col-xs-12';
	let labelClass = props.labelClass ? standard + ' ' + props.labelClass : standard;

	return (
		<div class={mainClass}>
			<label class={labelClass} style={cssStyle}>{props.name}</label>
		</div>
	)
}

export default label;