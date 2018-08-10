import React from 'react';

import mainModelInstance from '../../model/mainModel';
import productModelInstance from '../../model/productModel';
import { setModifiedData } from '../../functions/product/setModified';

import Config from '../../Config';
import Helper from '../../helper/Helper.jsx';
import Busy from '../dumb/Busy.jsx';
import Title from '../dumb/Title.jsx';

const styles = {
	padding15px: {paddingTop: '15px'}
};

export default class Modified extends React.Component {
	constructor(props){
		super(props);
		this.mainModel = mainModelInstance;
		this.model = productModelInstance();
		this.model.checkModified.subscribe(() => this.checkModified());
	}

	componentDidMount() {
		this.checkModified();
	}

	checkModified() {
		this.model.getModified()
			.then((response) => {
				this.model.modified.next(setModifiedData(response));
			})
			.catch((err) => this.mainModel.setMessage('warning', Config.message))
			.finally(() => this.props.after());
	}

	deleteItem = (id) => {
		this.model.deleteModified(id)
			.then((response) => {
				if (response.status === 200 && response.data.success) {
					this.mainModel.setMessage('success', response.data.reason);
					this.model.checkModified.next();
				} else {
					throw new Error(response.data.reason);
				}
			}).
		catch((err) => this.mainModel.setMessage('warning', err.message));
	}

	render() {
		const text = Config.message;
		if (this.props.search) {
			return (
				<Busy title={text.modifiedSearch} />
			);
		} else {
			if (this.props.list === null || this.props.list.length === 0) {
				return (
					<Title title={text.noModified} />
				)
			} else {
				let title = text.products.modifiedList;
				let head = Helper.createTableHead(['ID', 'Nazwa', 'Data', 'Akcja']);
				var list = this.props.list.map((el, index) => {
					let linkPath = Config.url.path + 'wagony-n/' + el.id + '-' + el.link_rewrite + '.html';
					return (
						<tr key={ index } class="textCentered">
							<td style={styles.padding15px}>{el.id}</td>
							<td style={styles.padding15px}><a href={linkPath} target="blank">{el.name}</a></td>
							<td style={styles.padding15px}>{el.date}</td>
							<td><input class="form-control btn btn-primary" type="button" value="Usuń" onClick={ (id) => this.deleteItem(el.id) } /></td>
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
}
