import React from 'react';

const footer = ( props ) => {
	if (props.curClass) {
		var curClass = props.curClass;
	} else {
		var curClass = "pull-right footer";
	}
	return (
		<div class={curClass}>
			<h4>Ad9bis w oparciu o ReactJS - 2018</h4>
		</div>
	);	
}

export default footer;