import React from 'react';

const title = ( props ) => {
	let curStyle = props.curStyle !== undefined ? props.curStyle : null;
	return (
		<div class="container">
		    <div class="col-xs-12" style={curStyle}>
			    <h3>{props.title}</h3>
			</div>
		</div>
	);
}

export default title;