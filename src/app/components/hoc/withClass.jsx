import React from 'react';

const withClass = (props) => (
	<div class={props.curClass} style={props.curStyle}>
		{props.children}
	</div>
)

export default withClass;