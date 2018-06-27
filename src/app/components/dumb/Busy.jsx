import React from 'react';
import OverlayLoader from 'react-loading-indicator-overlay/lib/OverlayLoader';

import Config from '../../Config.jsx';
import './busy.css';

const busy = ( props ) => {
	return (
		<div class="indicator">
			<OverlayLoader
				color={'blue'} // default is white
				loader="ScaleLoader" // check below for more loaders
				text={props.innerTitle}
				active={true}
				backgroundColor={'black'} // default is black
				opacity=".4" // default is .9
			 />
 			<p class="textBottom"><i>{props.title}</i></p>
		</div>
	);
}

export default busy;