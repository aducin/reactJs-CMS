import React from 'react';

import { Link } from 'react-router';

const header = ( props ) => {
	let fieldArray = props.fields.map((el, index) => {
		let curClass = props.active === el.link ? "btn btn-primary rightMargin" : "btn btn-info rightMargin";
		let curDisabled = props.active === el.link;
		return <Link key={ index } to={ el.link } disabled={curDisabled} class={ curClass }>{ el.name }</Link>
	});
	return(
		<div>
			<div class="headerList">
		  		<div class="col-xs-11 pull-left">
				  	{ fieldArray }	
				</div>
				<div class="col-xs-1 pull-right">
					<button type="button" onClick={ () => props.buttonHandler() } class="btn btn-danger btn-block logoutButton">Wyloguj</button>
				</div>
		  	</div>
		</div>
	);
}

export default header;