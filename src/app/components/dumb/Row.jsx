import React from 'react';

const row = ( props ) => {
	let labelWidth = 'col-xs-12 col-lg-6';
	let paragraphWidth = 'col-xs-12 col-lg-6';
	if (props.labelWidth !== undefined) {
		labelWidth = props.labelWidth;
	}
	if (props.paragraphWidth !== undefined) {
		paragraphWidth = props.paragraphWidth;
	}
	return (
		<div class="container">
			<div class="col-xs-12 col-lg-6">
				<label class={labelWidth}>{props.label}</label>
				<p class={paragraphWidth}>{props.content}</p>
			</div>
		</div>
	);
}

export default row;