import { ajax } from 'rxjs/ajax';
import { ofType } from 'redux-observable';
import { map, mapTo, mergeMap } from 'rxjs/operators';

export function clearBasic() {
	return {
		type: 'clear_basic',
		payload: null,
	}
}

export function clearData(button) {
	return {
		type: 'clear',
		payload: null,
	}
}

export function clearError() {
	return {
		type: 'clear_error',
		payload: null
	}
}

export function clearInputs(bool) {
	return {
		type: 'clear_inputs',
		payload: bool,
	}
}

export function prepareResult() {
	return {
		type: 'set_prepare',
		payload: null,
	}
}

export function setAction(name, data) {
	return { type: name, payload: data };
};

export function setBasicData(data) {
	return {
		type: 'set_basic',
		payload: data
	}
}

export function setCategory(list) {
	return {
		type: 'set_category',
		payload: list
	}
}

export function setConstant(data) {
	return {
		type: 'set_constant',
		payload: data
	}
}

export function setHistory(data, id) {
	if (data.success !== false) {
		let tempObj = {
			id: id,
			list: data,
		};
		return {
			type: 'set_history',
			payload: tempObj,
		}
	} else {
		return {
			type: 'set_history_empty',
			payload: id,
		}
	}
}

export function setIdResult(data) {
	if ((!data.first.empty && data.second === null) || (!data.first.empty && !data.second.empty)) {
		return {
			type: 'set_id_result',
			payload: data
		}
	} else {
		var final = {
			first: false,
			second: false,
		};
		if (data.first.empty) {
			final.first = data.first.reason;
		}
		if (data.second.empty) {
			final.second = data.second.reason;
		}
		return {
			type: 'set_empty',
			payload: final
		}
	}
}

export const setLastOrders = action$ => {
	return action$.pipe(
		ofType('setLastOrders'),
		mergeMap(action =>
			ajax.getJSON( action.payload )
				.map(response => {
					let curData = {};
					['list', 'newest', 'success'].forEach(el => curData[el] = response[el]);
					return setOrders(curData);
				})
		)
	);
};

export function setManufacturer(list) {
	return {
		type: 'set_manufacturer',
		payload: list
	}
}

export function setModified(data) {
	return {
		type: 'set_modified',
		payload: data
	}
}

export function setNameResult(data) {
	if (!data.empty) {
		return {
			type: 'set_name_result',
			payload: data,
		}
	} else {
		return {
			type: 'set_empty',
			payload: data.reason,
		}
	}
}

export function setOrders(data) {
	if (data.success) {
		return {
			type: 'set_last_orders',
			payload: {
				list: data.list,
				newest: data.newest
			}
		}
	} else {
		setError(data.reason);
	}
}

export function setOrdersSearch() {
	return {
		type: 'set_orders_search',
		payload: true
	}
}

export function setPrintings(data) {
	return {
		type: 'set_printings',
		payload: data
	}
}

export function setSaveResult(list) {
	return {
		type: 'set_save_result',
		payload: list.first
	}
}

export function setError() {
	return {
		type: 'set_error',
		payload: null
	}
}

export function setWarning(message) {
	return {
		type: 'set_warning',
		payload: message,
	}
}
