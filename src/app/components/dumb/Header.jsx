import React from 'react';

import { Link } from 'react-router';

const header = ( props ) => {
	let fieldArray = props.fields.map((el, index) => {
		let curClass = props.active === el.link ?
			"btn btn-primary headerButton rightMargin" :
			"btn btn-info headerButton rightMargin";
		let curDisabled = props.active === el.link;
		return (
				<Link
					key={ index }
					to={ el.link }
					disabled={ curDisabled || props.linkDisable }
					class={ curClass }
				>{ el.name }</Link>
		);
	});
	return(
		<div>
			<div class="headerList">
				<div class="col-xs-12 col-md-10 pull-left">
					{ fieldArray }
				</div>
				<div class="col-xs-12 col-sm-12 col-md-2 logoutMargin pull-right">
					<button type="button" onClick={ () => props.buttonHandler() } class="btn btn-danger btn-block logoutButton headerButton">Wyloguj</button>
				</div>
			</div>
		</div>
	);
}

export default header;