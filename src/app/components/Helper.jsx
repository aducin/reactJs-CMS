import React from 'react';

import Config from '../Config.jsx';

const styles = {
	centered: {textAlign: 'center'}
};
const Helper = {
	createTableHead: (list) => {
		let finalList = list.map((el, index) => {
			return <th key={index} style={styles.centered}>{el}</th>
		});
	    let head = (
	    	<thead>
				<tr>
					{finalList}  
				</tr>
			</thead>
		)
		return head;
	},
	setTable: (title, head, list) => {
		let final = (
			<div class="col-xs-12">
				<div class="paddingBottom1">
					<h3>{title}</h3>
			  	</div>
				<table class="table table-striped table-bordered">
				    {head}
				    <tbody>
				        {list}
				    </tbody>
				</table>
			</div>
		)
		return final;
	},
	setUrl: (path, secondPath, token) => {
		let url = Config.url.serverPath + Config.url[path] + '/' + secondPath;
		if (token) {
			url += '/' + token;
		}
		return url;
	}
}

export default Helper;