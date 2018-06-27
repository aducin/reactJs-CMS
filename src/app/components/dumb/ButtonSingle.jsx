import React from 'react';
import { Link } from 'react-router';

const buttonSingle = ( props ) => {
	return (
		<div class={props.classMain}>
			<Link to={props.link} class={props.className} style={props.styleName}>{props.content}</Link>
		</div>
	);
}

export default buttonSingle