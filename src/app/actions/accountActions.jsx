export function clearData(data) {
	return {
		type: 'clear_data',
		payload: null,
	}
}

export function setError(data) {
	return {
		type: 'set_error',
		payload: data,
	}
}

export function setList(data) {
	return {
		type: 'set_list',
		payload: data,
	}
}


