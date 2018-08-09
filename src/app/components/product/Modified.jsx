import React from 'react';

import Config from '../../Config';
import Helper from '../../helper/Helper.jsx';
import Busy from '../dumb/Busy.jsx';
import Title from '../dumb/Title.jsx';

const Modified = ( props ) => {
	const deleteItem = (id) => {
		props.model.deleteModified(id, props.token)
			.then((response) => {
				if (response.status === 200 && response.data.success) {
					props.mainModel.setMessage('success', response.data.reason);
					props.model.refreshModified();
				} else {
					throw new Error(response.data.reason);
				}
			}).
		catch((err) => props.mainModel.setMessage('warning', err.message));
	}
	const styles = {
		padding15px: {paddingTop: '15px'}
	};
	const text = Config.message;
	if (props.search) {
		return (
			<Busy title={text.modifiedSearch} />
		);
	} else {
		if (props.list === null || props.list.length === 0) {
			return (
				<Title title={text.noModified} />
			)
		} else {
			let title = 'Lista podmienionych produktów';
		 	let head = Helper.createTableHead(['ID', 'Nazwa', 'Data', 'Akcja']);
			var list = props.list.map((el, index) => {
				let linkPath = Config.url.path + 'wagony-n/' + el.id + '-' + el.link_rewrite + '.html';
				return (
					<tr key={ index } class="textCentered">
						<td style={styles.padding15px}>{el.id}</td>
						<td style={styles.padding15px}><a href={linkPath} target="blank">{el.name}</a></td>
						<td style={styles.padding15px}>{el.date}</td>
						<td><input class="form-control btn btn-primary" type="button" value="Usuń" onClick={ (id) => deleteItem(el.id) } /></td>
					</tr>
				)
			});
			let table = Helper.setTable(title, head, list);
			return (
				<div class="container bgrContent paddingBottom2 marginTop2 borderRadius10">
					{table} 
				</div>
			);
		}
	}
}

export default Modified;