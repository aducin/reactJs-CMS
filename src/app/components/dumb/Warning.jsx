import React from 'react';

const warning = ( props ) => {
	let container;
	let currentStyle;
	let currentTop;
	let firstRow;
	let secondRow;
	if (props.currentStyle !== undefined) {
		currentStyle = props.currentStyle;
	} else {
		currentStyle = null;
	}
	if (props.currentTop !== undefined) {
		currentTop = props.currentTop;
	} else {
		currentTop = null;
	}
	if (props.firstRow) {
		firstRow = "col-xs-12 " + props.firstRow;
	} else if (props.prevent) {
		firstRow = null;
	} else {
		firstRow = "col-xs-12";
	}
	if (!props.preventContainer) {
		container = 'container';
	} else {
		container = 'col-xs-12';
	}
	if (props.secondRow) {
		secondRow = props.secondRow + ' pull-left alert alert-danger';
	} else {
		secondRow = 'col-xs-6 pull-left alert alert-danger';
	}
	return(
		<div class={container}>
			<div class="col-xs-12"></div>
			<div class={firstRow} style={currentTop}>
			    <div class={secondRow} style={currentStyle}>
					<strong>Uwaga!</strong> {props.header} <i>{props.message}</i>
				</div>
			</div>
		</div>
	)
}

export default warning