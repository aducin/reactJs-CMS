import React from 'react';

const message = ( props ) => {
	let message;
	if (props.message) {
		message = (
			<div class="col-xs-6 pull-left">
				<div class={props.messageStyle}>
					<p>{props.message}</p>
				</div>
			</div>
		);
	}
	return (
		<div class="col-xs-12 marginTop50px">
			<div class="col-xs-3 pull-left"></div>
			{message}
		</div>
	);
}

export default message;