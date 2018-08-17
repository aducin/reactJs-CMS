import React from 'react';

const checkbox = ( props ) => {
	const handleChange = ( e ) => {
		var active = props.active;
		var id = parseInt(e.target.value);
		if (e.target.checked) {
			active.push(id);
			props.onHandleChange(active, props.name);
		} else{
			let check = props.active.indexOf(id);
			if (check !== -1) {
				active.splice(check, 1);
				props.onHandleChange(active, props.name);
			}
		}
	}
	let checkboxList = [];
	let cssStyle = null;
	if (props.cssStyle !== undefined) {
		cssStyle = props.cssStyle;
	}
	var active = props.active;
	props.categories.forEach((el, index) => {
		let obj = props.categories[index];
		let checkId = active.indexOf(el.id);
		let checked = checkId !== -1;
		let curName = el.metaTitle !== undefined ? el.metaTitle : el.name;
		checkboxList.push(<div key={el.id}><input type="checkbox" onChange={handleChange.bind(this)} defaultChecked={checked} name={curName} value={el.id} />  {curName}<br /></div>);
	});

	return (
		<div class="col-xs-12">
			<label onClick={() => props.toggle(props.name)} class="col-xs-12 col-lg-3" style={cssStyle}>{props.title}</label>
			<div class="col-xs-12 col-md-9" style={cssStyle}>
				{checkboxList}
			</div>
		</div>
	);
};

export default checkbox